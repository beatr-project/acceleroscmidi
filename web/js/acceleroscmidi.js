/**
 * Copyright beatr-project 2017
 */

angular.module('acceleroscmidi', [ 'ui.bootstrap' ])

  // Experience controller
  .controller('ExperienceCtrl', function($scope, $location) {
    var url = $location.protocol() + '://' + $location.host() + ':' +
              $location.port();
    var socket = io.connect(url);

    var pan = new Tone.Panner(0).toMaster();
    var effect = new Tone.Freeverb().connect(pan);
    var player = new Tone.Player("../audio/water_loopable.wav").connect(effect);
    player.autostart = true;
    player.loop = true;

    socket.on('accelerometer', function(accelerometer) {
      $scope.accelerometer = accelerometer;
      pan.pan.value = accelerometer.angX;
      effect.roomSize.value = (accelerometer.angY + 1) / 2;
      $scope.$apply();
    });
  });
