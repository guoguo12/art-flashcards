angular.module('flashcardApp', [])
  .controller('flashcardController', ['$scope', '$http', function($scope, $http) {
    $scope.showDescription = true;
    $scope.sets = ['Week 2']; // Not used 
    $scope.artworks = [];
    $scope.index = 0;
    $http.get('data/data.json')
      .success(function(data) {
        $scope.artworks = data.artworks;
        $scope.update();
      })
      .error(function(data) {
        // TODO: Show error message
      });
    $scope.moveLeft = function() {
      $scope.index = $scope.index - 1;
      while ($scope.index < 0) {
        $scope.index += $scope.artworks.length;
      }
      $scope.update();
    }
    $scope.moveRight = function() {
      $scope.index = ($scope.index + 1) % $scope.artworks.length;
      $scope.update();
    }      
    $scope.update = function() {
      var artwork = $scope.artworks[$scope.index];
      $scope.imageUrl = artwork.url;
      $scope.title = '\'' + artwork.title + '\'';
      $scope.artistDate = artwork.artist + ', ' + artwork.date;
    }
    $scope.onKeyUp = function($event) {
      if ($event.keyCode == 32) {
        // Space
        $scope.showDescription = !$scope.showDescription;
      } else if ($event.keyCode == 37) {
        // left arrow
        $scope.moveLeft();
      } else if ($event.keyCode == 39) {
        // Right arrow
        $scope.moveRight();
      }
      $event.preventDefault();
    };
  }]);