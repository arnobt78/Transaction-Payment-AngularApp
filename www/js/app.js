angular.module('xTan', ['ionic','ionic.service.core', 'xTan.controllers' , 'ngCordova' , 'xTan.services', 'pascalprecht.translate','angular-progress-arc'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }



    });
  })

  .config(function($stateProvider, $urlRouterProvider, $translateProvider) {

    $translateProvider.useStaticFilesLoader({prefix: 'locales/', suffix: '.json'});
    $translateProvider.preferredLanguage('en');
    $translateProvider.fallbackLanguage('en');


    $stateProvider


      .state('app', {
        url: '/app',
        abstract: true,
        cache: false,
        templateUrl: 'templates/sliding_menu.html',
        controller: 'SlidingMenuCtrl as slidingMenuCtrl'
      })


      .state('app.home', {
        url: '/home',
        params: {
          homePushParam: '', homeOtpParam: '',
        },
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/home_layout.html',
            controller: 'HomeCtrl as homeCtrl'
          }
        }
      })


      .state('app.otp_tan', {
        url: '/otp_tan',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/otp_tan_layout.html',
            controller: 'OtpTanCtrl as otpTanCtrl'
          }
        }
      })


      .state('app.push_tan', {
        url: '/push_tan',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/push_tan_layout.html',
            controller: 'PushTanCtrl as pushTanCtrl'
          }
        }
      })

      .state('app.help', {
        url: '/help',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/help_layout.html',
            controller: 'HelpCtrl as helpCtrl'
          }
        }
      })

      .state('app.settings', {
        url: '/settings',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/settings_layout.html',
            controller: 'SettingsCtrl as settingsCtrl'
          }
        }
      })

      .state('app.about', {
        url: '/about',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/about_layout.html',
            controller: 'AboutCtrl as aboutCtrl'
          }
        }
      })

      .state('choose_service', {
        url: '/choose_service',
        cache: false,
        templateUrl: 'templates/choose_service_layout.html',
        controller: 'ChooseServiceCtrl as chooseServiceCtrl'
      })

      .state('number_registration', {

        params: {
          itemClicked: '',
        },
        cache: false,
        url: '/number_registration',
        templateUrl: 'templates/number_registration_layout.html',
        controller: 'NumberRegistrationCtrl as numberRegistrationCtrl'
      })

      .state('number_verify', {
        params: {
          itemClicked: '', phoneNumberParam: '',
        },
        cache: false,
        url: '/number_verify',
        templateUrl: 'templates/number_verify_layout.html',
        controller: 'NumberVerifyCtrl as numberVerifyCtrl'
      })

    .state('verify_success', {
      params: {
        itemClicked: '', phoneNumberParam: '',
      },
      cache: false,
      url: '/verify_success',
      templateUrl: 'templates/verification_success_layout.html',
      controller: 'VerificationSuccessCtrl as verificationSuccessCtrl'
    });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/choose_service');
  });
