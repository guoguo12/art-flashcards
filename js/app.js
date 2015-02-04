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
        scope.$watchGroup(['index', 'artworks'], function(newVals, oldVals, scope) {
          element[0].style.width = 100 * (newVals[0] + 1) / scope.artworks.length + '%';
        });
      }
    }
  })
  .controller('flashcardController', ['$scope', '$http', function($scope, $http) {
    $scope.showDescription = true;
    $scope.sets = [];
    $scope.setNames = [];
    $scope.setName = '';
    $scope.artworks = [];
    $http.get('data/index.json')
      .success(function(data) {
        $scope.sets = data;
        $scope.setNames = Object.keys(data);
        $scope.updateSet($scope.setNames[0]);
      });
    $scope.updateSet = function(newSetName) {
      $scope.setName = newSetName;
      $http.get('data/' + $scope.sets[$scope.setName])
        .success(function(data) {
          console.log('Switching to ' + newSetName + '...');
          $scope.setName = data.name;
          $scope.artworks = data.artworks;
          $scope.index = 0;
          $scope.update();
        })
        .error(function(data) {
          // TODO: Show error message
        });
    }
    $scope.update = function() {
      var artwork = $scope.artworks[$scope.index];
      $scope.imageUrl = artwork.url;
      $scope.title = artwork.title;
      $scope.artistDate = artwork.artist + ', ' + artwork.date;
      _gaq.push(['_trackEvent', 'General', 'Update', artwork.title]);
    }    
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
    $scope.onKeyUp = function($event) {
      if ($event.keyCode == 32) {
        // Space
        $scope.showDescription = !$scope.showDescription;
      } else if ($event.keyCode == 37 || $event.keyCode == 65) {
        // left arrow or A
        $scope.moveLeft();
      } else if ($event.keyCode == 39 || $event.keyCode == 68) {
        // Right arrow or D
        $scope.moveRight();
      }
      $event.preventDefault();
    };
  }]);