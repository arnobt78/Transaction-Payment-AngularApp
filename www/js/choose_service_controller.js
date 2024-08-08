
angular.module('xTan.controllers')
  .controller('ChooseServiceCtrl', function ($scope,LocalStorage, $translate,$cordovaPreferences,$ionicLoading, $http,APICall, $state, $ionicPopup ,$ionicPlatform, $cordovaDevice)
  {
    var self = this;
    self.serviceName = '';
    self.pushtanValue = false;
    self.otptanValue = false;

    self.deviceToken  = '';
    self.deviceUdid = '';

    self.pushParam = '';
    self.otpParam = '';
    self.pushEventFired = '';

    self.pushtanEnrollment = $translate.instant('not-enroll-text');
    self.otptanEnrollment = $translate.instant('not-enroll-text');


    $ionicPlatform.ready(function() {
      $scope.$apply(function() {


        $translate.use('en');
        self.pushtanEnrollment = $translate.instant('not-enroll-text');
        self.otptanEnrollment = $translate.instant('not-enroll-text');



        $cordovaPreferences.fetch('key_push_tan', 'dic_user_info')
          .success(function(value) {
            console.log("pushtanEnrollment fetch: " + value);

            if(value!=null){
              self.pushParam=value;
            }

          })


        $cordovaPreferences.fetch('key_otp_tan', 'dic_user_info')
          .success(function(value) {
            console.log("otptanEnrollment fetch: " + value);
            if(value!=null)
            {
              self.otpParam = value;
            }
          })



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







        $cordovaPreferences.fetch('key_first', 'dic_user_info')
          .success(function(value) {
            console.log("key_first fetch: " + value);
            if(value!=null)
            {
              $state.transitionTo('app.home', {homePushParam: self.pushParam , homeOtpParam: self.otpParam}, {reload: true});
            }
          })


        var push = PushNotification.init({
          android: {
            senderID: "746306303756"
          },
          ios: {
            alert: "true",
            badge: "true",
            sound: "true"
          },
          windows: {}
        });

        push.on('registration', function(data) {
          console.log( "Dev Token:  " + data.registrationId);
          self.deviceToken  = data.registrationId;
          LocalStorage.Save('key_device_token', data.registrationId);
        });

        push.on('notification', function(data) {

          console.log("Push Notification Rec in choose service: " + data.message);

          alert("Push Notification Rec in choose service: " + data.message);


          //$rootScope.$broadcast('SOME_TAG', 'your value');

          // data.message,
          // data.title,
          // data.count,
          // data.sound,
          // data.image,
          // data.additionalData
        });

        push.on('error', function(e) {
          console.log( "Push Token Error" + e.message);
        });

        ///////////////////////////////////////////xxxxxxxxxxxxxxxxxxxxxxxxxx

        var device = $cordovaDevice.getDevice();
        self.deviceUdid = device.uuid;

        LocalStorage.Save('key_device_udid', self.deviceUdid);


        // $scope.manufacturer = device.manufacturer;
        // $scope.model = device.model;
        // $scope.platform = device.platform;
        //  console.log(device.uuid);

      });
    })



    self.ContinueButtonClick = function (paramenter) {

      self.serviceName = paramenter;
      console.log(self.serviceName + " is clicked from 1st page");

      if(self.serviceName === 'push')
      {
        $state.transitionTo('number_registration', {itemClicked: self.serviceName}, {reload: true});
      }
      else
      {
        $state.transitionTo('number_registration', {itemClicked: self.serviceName}, {reload: true});
      }

    }


  })
