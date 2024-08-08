/**
 * Created by Ishtiak on 19-Apr-16.
 */
angular.module('xTan.controllers')
  .controller('SettingsCtrl', function ($scope, LocalStorage, $ionicLoading,$ionicHistory,$ionicPopup,APICall, $window, $http, $state, $translate,$cordovaPreferences)
  {
    //$ionicNavBarDelegate.showBackButton(true);
    var self = this;


    $cordovaPreferences.fetch('key_user_language', 'dic_user_info')
      .success(function(value) {
        console.log("key_user_language fetch: " + value);
        if(value!=null && value === 'en')
        {
          self.selectedLanguage = 'English';
          self.eng = true;
          self.ger = false;
        }
        if(value!=null && value === 'de')
        {
          self.selectedLanguage = 'German';
          self.eng = false;
          self.ger = true;
        }
      })
      .error(function(error) {
        console.log("key_user_language fetch Error: " + error);
      });


    self.serviceName = '';
    self.hiddenPhoneNumber = '';
    self.pushtanEnrollment = $translate.instant('not-enroll-text');
    self.otptanEnrollment = $translate.instant('not-enroll-text');
    self.pushtanValue = false;
    self.otptanValue = false;
    self.key = '';
    self.selectedLanguage = 'English';
    self.phoneNumber = '';
    self.deviceUdid = '';

    self.eng = true;
    self.ger = false;





    $cordovaPreferences.fetch('key_device_udid', 'dic_user_info')
      .success(function(value) {
        console.log("key_device_udid fetch: " + value);
        self.deviceUdid = value;
      })
      .error(function(error) {
        console.log("key_device_udid fetch Error: " + error);
      });


    $cordovaPreferences.fetch('key_phone_number', 'dic_user_info')
      .success(function(value) {
        console.log("phone number fetch: " + value);
        self.phoneNumber = value;
        self.hiddenPhoneNumber =  value.slice(2,7) + "XXXXX" + value.slice(-4);
      })
      .error(function(error) {
        console.log("phone number fetch Error: " + error);
      });


    $cordovaPreferences.fetch('key_push_tan', 'dic_user_info')
      .success(function(value) {
        console.log("key_push_tan fetch: " + value);
        if(value!=null)
        {
          self.pushtanEnrollment = $translate.instant('enroll-text');
          self.pushtanValue = true;
        }

      })
      .error(function(error) {
        console.log("key_push_tan fetch Error: " + error);
      });


    $cordovaPreferences.fetch('key_otp_tan', 'dic_user_info')
      .success(function(value) {
        console.log(" key_otp_tan fetch: " + value);
        if(value!=null)
        {
          self.otptanEnrollment =  $translate.instant('enroll-text');
          self.otptanValue = true;
        }
      })
      .error(function(error) {
        console.log("key_otp_tan  fetch Error: " + error);
      });


    self.PushEnrollmentClick = function()
    {
      if(self.pushtanValue === false)
      {
        var confirmPopup = $ionicPopup.confirm({
          title: 'pushTAN Enrollment',
          template: 'Do you want to enroll for  pushTAN?'
        });

        confirmPopup.then(function(res) {
          if(res) {
            console.log('You are sure');
            $ionicLoading.show({templateUrl: 'templates/loading.html'});
            self.RegisterForService('push');

          } else {
            console.log('You are not sure');
          }
        });
      }
      else
      {
        $state.go('app.push_tan');
      }

    }

    self.OTPEnrollmentClick = function()
    {
      if(self.otptanValue  === false)
      {
        var confirmPopup = $ionicPopup.confirm({
          title: 'otpTAN enrollment',
          template: 'Do you want to enroll for otpTAN?'
        });

        confirmPopup.then(function (res) {
          if (res) {
            console.log('You are sure');
            $ionicLoading.show({templateUrl: 'templates/loading.html'});
            self.RegisterForService('otp');

          } else {
            console.log('You are not sure');
          }
        });
      }
      else {
        $state.go('app.otp_tan');
      }

    }


    self.RegisterForService= function (parameter) {

      self.serviceName = parameter;
      var registrationObject = {
        method: 'GET',
        url: "http://www.get-it-live.com/tanservice/device/register",
        params: {
          "number": self.phoneNumber,
          "type":"gcm",
          "method": self.serviceName,
          "deviceId":self.deviceUdid,
          "customer":"demo"
        }
      };


      APICall.ProcessHTTPRequest(registrationObject).then(function sucessCallback(response) {

        console.log("RegisterForService response: " +response.data.result);

        //2 not required
        //0 Success
        //1 deviceAlreadyRegistered

        if( response.data.result === 0  )
        {
          $ionicLoading.hide();
          if(self.serviceName === 'otp')
          {
            LocalStorage.Save('key_otp_tan', self.serviceName);
            LocalStorage.Save('key_secret', response.data.key);
          }
          else
          {
            LocalStorage.Save('key_push_tan', self.serviceName);
          }

          $state.transitionTo('verify_success', {itemClicked: self.serviceName, phoneNumberParam:self.phoneNumber}, {reload: true});

        }


      }, function errorCallback(response) {
        $ionicLoading.hide();
      });

    }



    //select language
    self.changeLanguage = function (selectedLanguage) {

      var key = '';

      switch (selectedLanguage) {
        case 'English':
          self.key = 'en';
          self.eng = true;
          self.ger = false;
          break;

        case 'German':
          self.key = 'de';
          self.eng = false;
          self.ger = true;
          break;
      }

      $translate.use(self.key);

      $cordovaPreferences.store('key_user_language',  self.key , 'dic_user_info')
        .success(function(value) {
          console.log("key_user_language store: " + value);
        })
        .error(function(error) {
          console.log("key_user_language store Error: " + error);
        });



    }






    self.ChangePhoneNumber = function()
    {
      self.showConfirmChangePhoneNo();
    }

    self.DeleteRegistration = function()
    {
      self.showConfirmDeleteRegistration();
    }

    self.DeleteAll = function()
    {
      $window.localStorage.clear();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $window.location.reload(true);

      LocalStorage.Remove('key_otp_tan');
      LocalStorage.Remove('key_push_tan');
      LocalStorage.Remove('key_phone_number');
      LocalStorage.Remove('key_first');

      self.DeregisterNumber('otp');
      self.DeregisterNumber('push');

      $state.transitionTo('choose_service', {}, {reload: true});
    }


    self.showConfirmChangePhoneNo = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Change Phone Number',
        template: 'Do you want to change phone number?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
          self.DeleteAll();

        } else {
          console.log('You are not sure');
        }
      });
    };

    self.showConfirmDeleteRegistration = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete Registration',
        template: 'Do you want to delete registration ?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
          self.DeleteAll();

        } else {
          console.log('You are not sure');
        }
      });
    };

    self.DeregisterNumber = function(parameter)
    {
      var registrationObject = {
        method: 'GET',
        url: "http://www.get-it-live.com/tanservice/device/register",
        params: {
          "number": self.phoneNumber,
          "type":"gcm",
          "method":parameter,
          "deviceId":self.deviceUdid,
          "customer":"demo",
          "revoke":1
        }
      };

      APICall.ProcessHTTPRequest(registrationObject).then(function sucessCallback(response) {
        console.log("DeregisterNumber response: " +response.data.result);

        $ionicLoading.hide();
      }, function errorCallback(response) {
        $ionicLoading.hide();
      });

    }


  })


