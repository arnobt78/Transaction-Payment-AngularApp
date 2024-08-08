/**
 * Created by Ishtiak on 19-Apr-16.
 */
angular.module('xTan.controllers')
  .controller('VerificationSuccessCtrl', function ($scope,$ionicNavBarDelegate,$translate, $http, $state,$stateParams,$cordovaPreferences,$stateParams)
  {
    $ionicNavBarDelegate.showBackButton(false);
    var self = this;
    self.title = '';
    self.tanValue ='';
    self.successfulMessage ='';

    $translate.use('en');

    $cordovaPreferences.store('key_phone_number', $stateParams.phoneNumberParam, 'dic_user_info')
      .success(function(value) {
        console.log("phone number save in preference: " + value);
      })
      .error(function(error) {
        console.log("phone number save in preference / Error : " + error);
      })


    if($stateParams.itemClicked === 'otp') {
      self.title = $translate.instant('verification-success-text');
      self.tanValue ='otp';
      self.successfulMessage = $translate.instant('otp-tan-verified-text') ; //"You have successfully enrolled in OTP TAN";

      $cordovaPreferences.store('key_otp_tan', 'otp' , 'dic_user_info')
        .success(function(value) {
          console.log("key_otp_tan store: " + value);
        })
        .error(function(error) {
          console.log("key_otp_tan store Error: " + error);
        })

    }
    else
    {
      self.title = $translate.instant('verification-success-text');
      self.tanValue ='push';
      self.successfulMessage = $translate.instant('push-tan-verified-text') ; //"You have successfully enrolled in Push TAN";

      $cordovaPreferences.store('key_push_tan', 'push' , 'dic_user_info')
        .success(function(value) {
          console.log("key_push_tan store: " + value);
        })
        .error(function(error) {
          console.log("key_push_tan store Error: " + error);
        })

    }


    self.NextClick = function()
    {
      if(self.tanValue ==='otp')
      {
        $state.transitionTo('app.otp_tan', {}, {reload: true});
      }
      else
      {
        $state.transitionTo('app.push_tan', {}, {reload: true});
      }
    }


  })


