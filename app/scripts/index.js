angular.module('welcomeApp', [])
  .controller('RegisterController', ['$scope', '$http', 'requestService', function ($scope, $http, requestService) {
    let _self = this
    $scope.info = {}
    $scope.cameraSettings = {
      showCamera: true,
      showPicture: false,
      picture: null
    }
    $scope.state = {
      showWelcome: true,
      showPictureScreen: false,
      showCapture: false,
      showFinalResult: false,
      showLoading: false
    }

    _self.saveInfo = function () {
      console.log($scope.info)
    }

    $scope.capturePicture = function () {
      Webcam.snap(function(data_uri) {
        $scope.showCamera = false
        $scope.showPicture = true
        $scope.picture = data_uri
      })
    }
  }])
  .directive('myCamera', function() {
    return {
      restric: 'E',
      scope: {
        camera: '=cameraStuff',
        state: '=appState'
      },
      templateUrl: 'templates/my-camera.html',
      link: function() {
        Webcam.set({
          width: 480,
          height: 480,
          image_format: 'jpeg',
          jpeg_quality: 90,
          fps: 45
        })
        Webcam.attach('#my_camera')
      },
      controller: ['$scope', function($scope) {
        $scope.goToForm = function() {
          console.log('💩')
          Webcam.snap(function(data_uri) {
            $scope.camera.showCamera = false
            $scope.camera.showPicture = true
            $scope.camera.picture = data_uri
            $scope.state.showCapture = true
            $scope.state.showPictureScreen = false
          })
        },
        $scope.returnIntro = function() {
          console.log('💩')
          $scope.state.showWelcome = true
          $scope.state.showPictureScreen = false
        }
      }]
    }
  })
  .directive('myForm', function() {
    return {
      restric: 'E',
      scope: {
        register: '=infoData',
        camera: '=cameraStuff',
        takePicture: '=capturePicture',
        state: '=appState'
      },
      templateUrl: 'templates/my-form.html',
      controller: ['$scope', function ($scope) {
        $scope.saveInfo = function() {
          // TODO: saving data...
          $scope.register.picture = $scope.camera.picture
          console.log($scope.register)
          $scope.state.showFinalResult = true
        },
        $scope.resetResult = function() {
          $scope.state.showFinalResult = false
          $scope.register.picture = null
        },
        $scope.resetCamera = function () {
          $scope.camera.showCamera = true
          $scope.camera.showPicture = false
          $scope.camera.picture = null
          $scope.state.showCapture = false
          $scope.state.showPictureScreen = true
        },
        $scope.returnIntro = function() {
          console.log('💩')
          $scope.state.showWelcome = true
          $scope.state.showPictureScreen = false
          $scope.state.showCapture = false
        },
        $scope.capturePic = function () {
          Webcam.snap(function(data_uri) {
            $scope.camera.showCamera = false
            $scope.camera.showPicture = true
            $scope.camera.picture = data_uri
          })
        }
      }]
    }
  })
  .directive('myIntro', function() {
    return {
      restric: 'E',
      scope: {
        state: '=appState',
        camera: '=cameraStuff'
      },
      templateUrl: 'templates/my-intro.html',
      controller: ['$scope', function($scope) {
        $scope.enterPicture = function() {
          console.log('💩')
          $scope.state.showWelcome = false
          $scope.state.showLoading = true
          // TODO: display loading...
          Webcam.snap(function(data_uri) {
            //alert(data_uri)
            // TODO: remove loading...
            alert(data_uri)
            $scope.camera.picture = data_uri
            $scope.state.showLoading = false
            $scope.state.showCapture = true
            $scope.camera.showCamera = false
            $scope.camera.showPicture = true
          })
        }
      }]
    }
  })
  .factory('requestService', function($http) {
    return {
      post: function (url, obj) {
        return $http.post(url, obj)
      },
      get: function (url, query) {
        return $http.get(`${url}?${query}`)
      }
    }
  })