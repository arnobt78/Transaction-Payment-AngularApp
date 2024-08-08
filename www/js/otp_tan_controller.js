/**
 * Created by Ishtiak on 19-Apr-16.
 */
/**
 * Created by Ishtiak on 19-Apr-16.
 */
angular.module('xTan.controllers')
  .controller('OtpTanCtrl', function ($scope,$translate,$ionicNavBarDelegate, $http, $state, $ionicPopup ,$ionicPlatform, $cordovaDevice,  $cordovaPreferences , $interval,  $translate,$stateParams)
  {
    $ionicNavBarDelegate.showBackButton(false);
    var self = this;
    //$translate.use('en');


    self.totpValue = '';
    self.timeLeft= 30;
    self.secondForUI = 30;
    self.circleStep = 0.03;
    self.otptanValue = false;
    self.otpFirstMessage = "You have not enrolled for otpTAN yet.";
    self.circleSum = 1.00;

    $scope.size = 80;
    $scope.progress = 1.00;
    $scope.strokeWidth = 80;
    $scope.stroke = '#012b5d';
    $scope.counterClockwise = 'true';

    self.secret = "B2374TNIQ3HKC446";

    self.timerInitializedGer = false;
    self.timerInitializedCou = false;
    var timerGen;
    var timerCou;


    $cordovaPreferences.fetch('key_otp_tan', 'dic_user_info')
      .success(function(value) {
        console.log("otptanEnrollment fetch: " + value);
        if(value!=null)
        {
          self.otptanValue = true;
          self.otpFirstMessage = $translate.instant('otp-tan-bank-text');

        }
      })
      .error(function(error) {
        console.log("otptanEnrollment fetch Error: " + error);
        self.otptanValue = false;
      })


    $cordovaPreferences.fetch('key_secret', 'dic_user_info')
      .success(function(value) {
        console.log("key_secret fetch: " + value);
        if(value!=null)
        {
          self.secret = value;

          self.GenerateTOTP();
          self.CountDownTimer();

          self.timerInitializedGer = true;
          self.timerInitializedCou = true;

          timerGen= $interval( function(){
            self.GenerateTOTP();
          }, 30000); //30 Seconds Default

          timerCou = $interval( function(){
            self.CountDownTimer();
          }, 1000);

        }
      })


    self.Pad = function(n) {
      return ( n>=0 && n < 10  ) ? ("0" + n) : n;
    }

    ///////////////////////////////////////

    self.CountDownTimer = function ()
    {
      if(self.timeLeft > 0 && self.timeLeft <= 30)
      {
        self.timeLeft = self.timeLeft - 1;
        if(self.timeLeft <=9) {
          self.secondForUI = self.Pad(self.timeLeft);
        }
        else {
          self.secondForUI = self.timeLeft;
        }
        self.circleSum = self.circleSum - self.circleStep;
        $scope.progress = self.circleSum;
      }
      else
      {
        self.timeLeft = 30;
        self.secondForUI = self.timeLeft;
        $scope.progress = 1.00;
        self.circleSum = 1.00;
      }

    }

    self.GenerateTOTP = function ()
    {
      var generator = new AeroGear.Totp(self.secret);
      // generate token
      generator.generateOTP(function(result) {
        self.totpValue = result;
        console.log(result);
      });

    }





    $scope.$on('$ionicView.afterLeave', function(){

      self.timeLeft = 30;
      $scope.progress = 1.00;
      self.circleSum = 1.00;

      if( self.timerInitializedGer === true)
      {
        $interval.cancel(timerGen);
      }
      if( self.timerInitializedCou === true)
      {
        $interval.cancel(timerCou);
      }
    });

    $ionicPlatform.registerBackButtonAction(function (event) {

        navigator.app.exitApp();

    }, 100);


  })

