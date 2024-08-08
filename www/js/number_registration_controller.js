/**
 * Created by Ishtiak on 19-Apr-16.
 */

angular.module('xTan.controllers')
  .controller('NumberRegistrationCtrl', function ($scope,LocalStorage, $ionicPopup, $http, $state,$stateParams,$ionicNavBarDelegate,$ionicLoading, $cordovaPreferences, APICall,$translate,$stateParams)
  {
    $ionicNavBarDelegate.showBackButton(false);

    var self = this;
    self.phoneNumber = '';
    self.serviceName = '';
    self.deviceUdid = '123456789';

    self.title = "";

    $translate.use('en');

    if($stateParams.itemClicked === 'otp') {
      self.title = $translate.instant('otp-tan-enrollment-text');
      self.serviceName = 'otp';
    }
    else
    {
      self.title = $translate.instant('push-tan-enrollment-text');
      self.serviceName = 'push';
    }


    self.PressNumber= function (pressedValue) {
      if(self.phoneNumber.length != 15) {
        self.phoneNumber = self.phoneNumber + pressedValue;
      }
      else
      {
        self.phoneNumber = self.phoneNumber;
      }
    }

    self.DeleteNumber= function () {
      if(self.phoneNumber.length!=0)
      {
        self.phoneNumber = self.phoneNumber.slice(0, -1);
      }
    }

    self.IsNumberComplete= function () {

      if(self.phoneNumber.length >= 10)
      {
        return false;
      }
      else
      {
        return true;
      }
    }

    self.IsNumberZero= function () {

      if(self.phoneNumber.length == 0) {
        return true;
      }
      else {
        return false;
      }
    }

    self.OkClick= function () {
      $ionicLoading.show({templateUrl: 'templates/loading.html'});
      self.RegisterForService();
    }

    self.CancelClick = function() {
      self.CancelOperation();
    }


    $cordovaPreferences.fetch('key_device_udid', 'dic_user_info')
      .success(function(value) {
        if(value!=null) {
          self.deviceUdid = value;
        }
      })



    self.RegisterForService= function () {

      var registrationObject = {
        method: 'GET',
        url: "http://www.get-it-live.com/tanservice/device/register",
        params: {
          "number": self.phoneNumber,
          "type":"gcm",
          "method":self.serviceName,
          "deviceId":self.deviceUdid,
          "customer":"demo"
        }
      };


      APICall.ProcessHTTPRequest(registrationObject).then(function sucessCallback(response) {

        console.log("RegisterForService response: " +response.data.result);

        //2 not required
        //0 Success
        //1 deviceAlreadyRegistered
        if(self.serviceName === 'otp')
        {
          LocalStorage.Save('key_secret', response.data.key);
        }

		// ST -->
		// handle all success responsens
		// only call verify if verify is required
		// close hiding and transition upon success
        if( response.data.result === 0 )
        {
          if(response.data.verificationRequired === true)
          {
            self.VerifyNumber();
          }
          else
          {
            $ionicLoading.hide();
            LocalStorage.Save('key_first', 'firsttime');
            LocalStorage.Save('key_service_name', self.serviceName);
            $state.transitionTo('verify_success', {itemClicked: self.serviceName, phoneNumberParam:self.phoneNumber}, {reload: true});
          }
        }else if(response.data.result === 1 )
        {
          $ionicLoading.hide();
          self.AlreadyRegisteredPopUp();
        }
		// other return codes
		//<-- ST


      }, function errorCallback(response) {
        $ionicLoading.hide();
      });

    }

    // Server will send SMS.
    self.VerifyNumber= function () {

      var verifyObject = {
        method: 'GET',
        url: "http://www.get-it-live.com/tanservice/device/verify",
        params: {
          "number": self.phoneNumber,
          "method":self.serviceName,
          "deviceId":self.deviceUdid
        }
      };

      APICall.ProcessHTTPRequest(verifyObject).then(function sucessCallback(response) {
        console.log("VerifyNumber response: " + response.data.result);
        if(response.data.result === 0 || response.data.result === -12 )
        {
          $ionicLoading.hide();
           $state.transitionTo('number_verify', {itemClicked: self.serviceName , phoneNumberParam:self.phoneNumber }, {reload: true});
        }

        if(response.data.result === -11 || response.data.result === -13 )
        {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: 'Invalid Number',
            template: 'Please check your number!'
          });

          alertPopup.then(function(res) {
            self.phoneNumber = '';
          });
        }


        $ionicLoading.hide();
      }, function errorCallback(response) {
        $ionicLoading.hide();
      });

    }

    self.CancelOperation = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: self.title,
        template: 'Do you want to cancel this operation?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          console.log('CancelOperation ok');
          $state.transitionTo('choose_service', {}, {reload: true});

        } else {
          console.log('CancelOperation not ok');
        }
      });
    };

    self.AlreadyRegisteredPopUp = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: self.title,
        template: 'Do you want to register again ?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          console.log('RevokeRegistration Ok');

          $ionicLoading.show({templateUrl: 'templates/loading.html'});
          self.RevokeRegistration();


        } else {
          console.log('RevokeRegistration cancel');
        }
      });
    };

    self.RevokeRegistration= function () {

      var revokeRegistration = {
        method: 'GET',
        url: "http://www.get-it-live.com/tanservice/device/register",
        params: {
          "number": self.phoneNumber,
          "type": "gcm",
          "method": self.serviceName,
          "deviceId": self.deviceUdid,
          "customer": "demo",
          "revoke":1
        }
      };


      APICall.ProcessHTTPRequest(revokeRegistration).then(function sucessCallback(response) {

        console.log("RegisterForService response: " +response.data.result);

        if( response.data.result === 0 )
        {
          self.RegisterForService();
        }

      }, function errorCallback(response) {
        $ionicLoading.hide();
      });

    }


    })

//00491601234567890
