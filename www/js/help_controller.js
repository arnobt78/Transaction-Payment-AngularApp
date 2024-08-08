/**
 * Created by Ishtiak on 19-Apr-16.
 */
angular.module('xTan.controllers')
  .controller('HelpCtrl', function ($scope, $http, $state,$filter)
  {
    //$ionicNavBarDelegate.showBackButton(true);
    var self = this;

    self.searchTextofHelp = '';

    self.questionandanswer = {
      question: '',
      answer: ''
    };

    self.questionandanswers = [
      {
        question: 'What is Loren Ipsum?',
        answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
      },
      {
        question: 'Lorem Ipsum come form?',
        answer: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.'
      },
      {
        question: 'Need description of Lorem',
        answer: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using  making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for  will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)'
      }
    ];

    // showing more info by using accordion
    self.toggleGroup = function(aa) {
      if (self.isGroupShown(aa)) {
        self.shownGroup = null;
      } else {
        self.shownGroup = aa;
      }
    };

    self.isGroupShown = function(aa) {
      return self.shownGroup === aa;
    };


  })
