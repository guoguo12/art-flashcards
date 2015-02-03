angular.module('flashcardApp', [])
  .directive('picturePlaceholder', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$watch('imageUrl', function(newVal, oldVal) {
          if (newVal != oldVal) {
            var container = $(element[0]);
            container.empty();
            // Create and add spinner
            var spinner = new Image();
            spinner.id = 'spinner';
            spinner.className = 'animated fadeIn';            
            spinner.src = 'images/spinner.gif';
            container.append(spinner);
            // Create image and begin loading
            var image = new Image();
            image.id = 'picture';
            image.className = 'animated fadeIn';
            image.onload = function() {
              container.empty();
              container.append(image);
            }
            image.src = newVal;
          }
        });
      }
    }
  })
  .directive('progressBar', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$watch('index', function(newVal, oldVal) {
          element[0].style.width = 100 * (newVal + 1) / scope.artworks.length + '%';
        });
      }
    }
  })
  .controller('flashcardController', ['$scope', '$http', function($scope, $http) {
    $scope.showDescription = true;
    $scope.sets = ['Week 2']; // Not used 
    $scope.setName = 'Week 2';
    $scope.artworks = [];
    $http.get('data/week2.json')
      .success(function(data) {
        $scope.artworks = data.artworks;
        $scope.index = 0;
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
      _gaq.push(['_trackEvent', 'General', 'Update', artwork.title]);
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