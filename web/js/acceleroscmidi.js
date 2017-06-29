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
    var effect = new Tone.Chorus(60, 2.5, 0.1).connect(pan);
    var synth = new Tone.AMOscillator("C3", "sine", "sine").connect(effect).start();

    socket.on('accelerometer', function(accelerometer) {
      $scope.accelerometer = accelerometer;
      pan.pan.value = accelerometer.angX;
      effect.frequency.value = (accelerometer.angY + 1) * 4;
      $scope.$apply();
    });
  });
