/**
 * Copyright beatr-project 2017
 */

angular.module('acceleroscmidi', [ 'ui.bootstrap' ])

  // Experience controller
  .controller('ExperienceCtrl', function($scope, $location) {
    var url = $location.protocol() + '://' + $location.host() + ':' +
              $location.port();
    var socket = io.connect(url);

    socket.on('accelerometer', function(accelerometer) {
    });
  });
