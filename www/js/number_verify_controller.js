/**
 * Created by Ishtiak on 19-Apr-16.
 */
angular.module('xTan.controllers')
  .controller('NumberVerifyCtrl', function ($scope,LocalStorage, $http,$stateParams, $state,$ionicNavBarDelegate,$cordovaPreferences,$ionicLoading, APICall,$ionicPopup)
  {
    $ionicNavBarDelegate.showBackButton(false);

    var self = this;
    self.verificationCode = '';
    self.hiddenPhoneNumber = '';
    self.phoneNumber = '';
    self.serviceName = '';
    self.deviceUdid = '';
    self.deviceToken ='';
    self.title = "";


    self.phoneNumber = $stateParams.phoneNumberParam;
    self.hiddenPhoneNumber =  self.phoneNumber.slice(2,7) + "XXXXX" + self.phoneNumber.slice(-4);

    if($stateParams.itemClicked === 'otp') {
      self.title = "otpTAN Verification";
      self.serviceName = 'otp';
    }
    else
    {
      self.title = "pushTAN Verification";
      self.serviceName = 'push';

    }

    $cordovaPreferences.fetch('key_device_udid', 'dic_user_info')
      .success(function(value) {
        console.log("device udid fetch: " + value);
        self.deviceUdid = value;
      })
      .error(function(error) {
        console.log("device udid fetch Error: " + error);
      })


    $cordovaPreferences.fetch('key_device_token', 'dic_user_info')
      .success(function(value) {
        console.log("key_device_token fetch: " + value);
        self.deviceToken = value;

      })
      .error(function(error) {
        console.log("key_device_token fetch Error: " + error);
      })


    self.PressNumber= function (pressedValue) {
      if(self.verificationCode.length != 6) {
        self.verificationCode = self.verificationCode + pressedValue;
      }
      else {
        self.verificationCode = self.verificationCode;
      }
    }

    self.DeleteNumber= function () {
      if(self.verificationCode.length!=0) {
        self.verificationCode = self.verificationCode.slice(0, -1);
      }
    }

    self.IsNumberComplete= function () {
      if(self.verificationCode.length == 6) {
        return false;
      }
      else {
        return true;
      }
    }

    self.IsNumberZero= function () {

      if(self.verificationCode.length == 0) {
        return true;
      }
      else {
        return false;
      }
    }

    self.OkClick= function () {
      $ionicLoading.show({templateUrl: 'templates/loading.html'});
      self.VerifyNumberWithTan();
    }

    self.CancelClick = function() {
      self.CancelOperationPopUp();
    }

    self.VerifyNumberWithTan= function ()
    {
      var verifyObjectWithTan = {
        method: 'GET',
        url: "http://www.get-it-live.com/tanservice/device/verify",
        params: {
          "number": self.phoneNumber,
          "method":self.serviceName,
          "deviceId":self.deviceUdid,
          "tan": self.verificationCode
        }
      };


      APICall.ProcessHTTPRequest(verifyObjectWithTan).then(function sucessCallback(response) {
        console.log("Verify with Tan" + response.data.result);
        if(response.data.result === 0)
        {
            $ionicLoading.hide();
            LocalStorage.Save('key_first', 'firsttime');
            LocalStorage.Save('key_service_name', self.serviceName);
            $state.transitionTo('verify_success', {itemClicked: self.serviceName, phoneNumberParam:self.phoneNumber}, {reload: true});
        }
        else
        {
          $ionicLoading.hide();
          self.ValidationNotDonePopUp();
        }


      }, function errorCallback(response) {
        $ionicLoading.hide();
      });
    }


    self.CancelOperationPopUp = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: self.title,
        template: 'Do you want to cancel this operation?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          $state.transitionTo('number_registration', {}, {reload: true});
        } else {

        }
      });
    };

    self.ValidationNotDonePopUp = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: self.title,
        okText: 'Resend Code',
        cancelText: 'Try Again',
        template: 'Verification code that you entered is not valid.'
      });

      confirmPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
          $ionicLoading.show({templateUrl: 'templates/loading.html'});
          self.RevokeRegistration();
          } else {
          console.log('You are not sure');
          self.verificationCode = '';
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


        if( response.data.result === 0 && response.data.verificationRequired === true )
        {
          self.VerifyNumber();
        }

        if(response.data.result === 1 )
        {
          $ionicLoading.hide();
          //self.AlreadyRegisteredPopUp();
        }


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
        $ionicLoading.hide();
      }, function errorCallback(response) {
        $ionicLoading.hide();
      });

    }

  })
