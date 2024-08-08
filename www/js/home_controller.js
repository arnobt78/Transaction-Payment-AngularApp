/**
 * Created by Ishtiak on 19-Apr-16.
 */
angular.module('xTan.controllers')
  .controller('HomeCtrl', function ($scope,$translate,LocalStorage,$stateParams, $ionicLoading, $ionicLoading, $http,APICall, $state, $ionicPopup ,$ionicPlatform, $cordovaDevice,  $cordovaPreferences , $interval,  $translate,$stateParams)
  {
    var self = this;

    $cordovaPreferences.fetch('key_user_language', 'dic_user_info')
      .success(function(value) {
        console.log("key_user_language fetch: " + value);
        self.userLanguage = value;
        if(value!=null)
        {
          $translate.use(value);
        }
        else
        {
          $translate.use('en');
        }
      })
      .error(function(error) {
        console.log("key_user_language fetch Error: " + error);
        $translate.use('en');
      })


    self.serviceName = '';
    self.totpValue = '';
    self.timeLeft= 30;
    self.pushtanEnrollment = $translate.instant('not-enroll-text');
    self.otptanEnrollment = $translate.instant('not-enroll-text');
    self.pushtanValue = false;
    self.otptanValue = false;
    self.userLanguage = "";

    self.phoneNumber = '';
    self.deviceUdid  = '';

    if($stateParams.homePushParam === 'push') {
      self.pushtanValue = true;
      self.pushtanEnrollment = $translate.instant('enroll-text');

    }

    if($stateParams.homeOtpParam === 'otp') {
      self.otptanValue = true;
      self.otptanEnrollment = $translate.instant('enroll-text');
    }




    $cordovaPreferences.fetch('key_phone_number', 'dic_user_info')
          .success(function(value) {
            console.log("phone number fetch: " + value);

            if(value!=null)
            {
              self.phoneNumber =value;
              self.phoneNumberAlreadyVerified = true;
            }

          })
          .error(function(error) {
            console.log("phone number fetch Error: " + error);
          })


    $cordovaPreferences.fetch('key_device_udid', 'dic_user_info')
      .success(function(value) {
        console.log("key_device_udid fetch: " + value);

        if(value!=null)
        {
          self.deviceUdid =value;
        }

      })
      .error(function(error) {
        console.log("phone number fetch Error: " + error);
      })







        $cordovaPreferences.fetch('key_push_tan', 'dic_user_info')
          .success(function(value) {
            console.log("pushtanEnrollment fetch: " + value);

            if(value!=null){
              self.pushtanValue = true;
              self.pushtanEnrollment = $translate.instant('enroll-text');
            }

          })
          .error(function(error) {
            console.log("pushtanEnrollment fetch Error: " + error);
            self.pushtanEnrollment = $translate.instant('not-enroll-text');
            self.pushtanValue = false;

          })


        $cordovaPreferences.fetch('key_otp_tan', 'dic_user_info')
          .success(function(value) {
            console.log("otptanEnrollment fetch: " + value);
            if(value!=null)
            {
              self.otptanValue = true;
              self.otptanEnrollment = $translate.instant('enroll-text');


            }

          })
          .error(function(error) {
            console.log("otptanEnrollment fetch Error: " + error);
            self.otptanValue = false;
            self.otptanEnrollment = $translate.instant('not-enroll-text');

            $ionicLoading.hide();

          })






    self.ContinueButtonClick = function (paramenter) {

      self.serviceName = paramenter;
      console.log(self.serviceName);

      if(self.serviceName ==='otp' && self.otptanValue)
      {
        $state.go('app.otp_tan');
      }
      else {
        self.PushEnrollmentClick();
      }

      if(self.serviceName ==='push' && self.pushtanValue)
      {
        $state.go('app.push_tan');
      }
      else
      {
        self.OTPEnrollmentClick();
      }

    }




    self.PushEnrollmentClick = function()
    {
      if(self.pushtanValue === false)
      {
        var confirmPopup = $ionicPopup.confirm({
          title: 'pushTAN enrollment',
          template: 'Do you want to enroll for Push TAN?'
        });

        confirmPopup.then(function(res) {
          if(res) {
            console.log('You are sure');
            $ionicLoading.show({templateUrl: 'templates/loading.html'});
            self.RegisterForService();

          } else {
            console.log('You are not sure');
          }
        });
      }

    }

    self.OTPEnrollmentClick = function()
    {
      if(self.otptanValue  === false) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'otpTAN enrollment',
          template: 'Do you want to enroll for OTP TAN?'
        });

        confirmPopup.then(function (res) {
          if (res) {
            console.log('You are sure');
            $ionicLoading.show({templateUrl: 'templates/loading.html'});
            self.RegisterForService();

          } else {
            console.log('You are not sure');
          }
        });
      }

    }


    self.RegisterForService= function () {

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


		// ST already registered can include values for otp/push
        if( response.data.result === 0 || response.data.result === 1 )
        {
          $ionicLoading.hide();
          if(self.serviceName === 'otp')
          {
            LocalStorage.Save('key_otp_tan', self.serviceName);
			if(response.data.key)
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

    $ionicPlatform.registerBackButtonAction(function (event) {

      navigator.app.exitApp();

    }, 100);




  })
