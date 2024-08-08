/**
 * Created by Ishtiak on 19-Apr-16.
 */
/**
 * Created by Ishtiak on 19-Apr-16.
 */
angular.module('xTan.controllers')
  .controller('PushTanCtrl', function ($scope,$translate,$timeout,LocalStorage,$ionicNavBarDelegate,$rootScope, APICall, $http,$ionicLoading, $state,$cordovaPreferences,$interval,$ionicPlatform,$translate,$stateParams)
  {
    $ionicNavBarDelegate.showBackButton(false);
    var self = this;
    //$translate.use('en');
    $scope.Math = window.Math;

    self.phoneNumber = '';
    self.deviceUdid = '';
    self.deviceToken = '0';

    self.pushtanValue = false;
    self.pushFirstMessage = $translate.instant('no-tan-available');
    self.pushMessage = '';
    self.timeFromServer= 0;

    $scope.size = 80;
    $scope.progress = 1.00;
    $scope.strokeWidth = 80;
    $scope.stroke = '#012b5d';
    $scope.counterClockwise = 'true';


    self.secondsForCal = 60;

    self.timerInitialized = false;
    var timer;

    $ionicLoading.show({templateUrl: 'templates/loading.html'});

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
      LocalStorage.Save('key_device_token',  self.deviceToken);
    });

    push.on('notification', function(data) {
      alert("Push Notification on push tan controller : " + data.message);
      //console.log("Push Notification received in application: " + data.message);
      self.pushMessage = '';
      self.generatedPushTan = '';

      $ionicLoading.show({templateUrl: 'templates/loading.html'});
      self.UpdateNumberForPushTan();


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




    $cordovaPreferences.fetch('key_push_tan', 'dic_user_info')
      .success(function(value) {
        console.log("key_push_tan fetch: " + value);
        if(value!=null)
        {
          self.serviceName = value;
        }
      })
      .error(function(error) {
        console.log("key_push_tan fetch Error: " + error);
        self.otptanValue = false;
      })


    $cordovaPreferences.fetch('key_device_udid', 'dic_user_info')
      .success(function(value) {
        console.log("device udid fetch: " + value);
        self.deviceUdid = value;
      })
      .error(function(error) {
        console.log("device udid fetch Error: " + error);
      })

    $cordovaPreferences.fetch('key_phone_number', 'dic_user_info')
      .success(function(value) {
        console.log("phone number fetch: " + value);
        self.phoneNumber =  value;

      })
      .error(function(error) {
        console.log("phone number fetch Error: " + error);
      });


    $timeout(callAtTimeout, 4000);



    function callAtTimeout() {
        console.log("Timeout occurred");
      self.UpdateNumberForPushTan();

    }



    self.CountDownTimer = function ()
    {
      if(self.timeLeft > 0 && self.timeLeft <=  self.totalTime )
      {
        self.timeLeft = self.timeLeft - 1;

        self.circleSum = self.circleSum - self.circleStep;

        $scope.progress = self.circleSum;


        if(self.firstTickInSecond === true)
        {
          self.firstTickInSecond = false;
          self.minutesForUI = self.Pad(self.minutesForCal);
        }


        self.secondsForCal = self.secondsForCal - 1;


        if(self.secondsForCal>0 && self.secondsForCal<=9)
        {
          self.secondsForUI = self.Pad(self.secondsForCal);
        }
        else if( self.secondsForCal==0)
        {
          self.secondsForCal = 60;
          self.secondsForUI = '00';

          if(self.minutesForCal != 0 )
          {
            self.minutesForCal--;
            self.minutesForUI = self.Pad( self.minutesForCal);

          }
        }
        else
        {
          self.secondsForUI = self.secondsForCal;
        }




      }
      else
      {
        self.timeLeft = self.totalTime;
        $scope.progress = 1.00;
        self.circleSum = 1.00;
        self.pushtanValue = false;
        self.pushFirstMessage = $translate.instant('no-tan-available');

      }

    }



    self.Pad = function(n) {
      return ( n>=0 && n < 10  ) ? ("0" + n) : n;
    }



    $scope.$on('$ionicView.afterLeave', function(){
      self.timeLeft = self.totalTime;
      $scope.progress = 1.00;
      self.circleSum = 1.00;
      self.minutesForCal= 4.00;
      self.minutesForUI = self.Pad( self.minutesForCal);


      if(self.timerInitialized === true)
      {
        $interval.cancel(timer);
      }

    });

    $ionicPlatform.registerBackButtonAction(function (event) {

      navigator.app.exitApp();

    }, 100);




    self.UpdateNumberForPushTan= function ()
    {
      var updateObject = {
        method: 'GET',
        url: "http://www.get-it-live.com/tanservice/device/update",
        params: {
          "number": self.phoneNumber,
          "method":'push',
          "deviceId":self.deviceUdid,
          "token": self.deviceToken
        }
      };

      APICall.ProcessHTTPRequest(updateObject).then(function sucessCallback(response) {
        console.log("Update Number: " + response.data.result);
        if(response.data.result === 0)
        {
          self.GetPushTanFromServer();
        }
        else
        {
          $ionicLoading.hide();
          alert("An error occurred in Server");
        }

      }, function errorCallback(response) {
        $ionicLoading.hide();
      });
    }



    self.GetPushTanFromServer = function()
    {
      var getObject = {
        method: 'GET',
        url: "http://www.get-it-live.com/tanservice/create/get",
        params: {
          "number": self.phoneNumber,
          "deviceId":self.deviceUdid
        }
      };

      APICall.ProcessHTTPRequest(getObject).then(function sucessCallback(response) {
        console.log("getObject " + response.data.result);
        if(response.data.result === 0 && response.data.tanList != undefined)
        {
          self.pushtanValue = true;
          self.pushFirstMessage = $translate.instant('push-tan-bank-text');
          self.generatedPushTan = response.data.tanList[0].tan;//response.data.tanList.tan;

          console.log("Push Tan: " + response.data.tanList[0].tan);
          console.log("Push Message: " + response.data.tanList[0].message);


          self.pushMessage = response.data.tanList[0].message;

          var time = response.data.tanList[0].secondsToLive;

          self.timeFromServer = $scope.Math.ceil(time/60);

          if(self.timeFromServer == 1)
          {
            self.minutesForUI = '00';
            self.firstTickInSecond = false;
          }
          else
          {
            self.firstTickInSecond = true;
          }

          self.totalTime =  self.timeFromServer * 60;


          self.minutesForCal= self.timeFromServer -1 ;
          self.timeLeft= self.totalTime;
          self.circleStep = (1/self.totalTime);
          self.circleSum = 1.00;


          self.minutesForUI = self.Pad(self.timeFromServer);
          self.secondsForUI = '00';





         /* self.minutesForCal= 4.00;
          self.seconds= 60.00;
          self.totalTime= (1 + self.minutesForCal) * self.seconds;
          self.timeLeft= self.totalTime;
          self.circleStep = (1/self.totalTime);
          self.circleSum = 1.00;*/





          $ionicLoading.hide();

          self.timerInitialized = true;
          timer = $interval( function(){
            self.CountDownTimer();
          }, 1000);

        }
        else
        {
          self.pushtanValue = false;
          $ionicLoading.hide();
        }

        $ionicLoading.hide();
      }, function errorCallback(response) {
        $ionicLoading.hide();
      });

    }








  })

