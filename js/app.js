angular.module('flashcardApp', [])
  .directive('placeholderOnLoad', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$watch('imageUrl', function(newVal, oldVal) {
          if (newVal != oldVal) {
            var img = element[0];
            img.style.display = 'none';
            var temp = new Image();
            temp.onload = function() {
              img.src = temp.src;
              img.style.display = 'block';
            }
            temp.src = newVal;
          }
        })
      }
    }
  })
  .controller('flashcardController', ['$scope', '$http', function($scope, $http) {
    $scope.showDescription = true;
    $scope.sets = ['Week 2']; // Not used 
    $scope.artworks = [];
    $scope.index = 0;
    $http.get('data/week2.json')
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
      $scope.title = artwork.title;
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