<!doctype html>
<html ng-app="welcomeApp">
  <head>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.5/angular.min.js"></script>
    <script src="scripts/index.js"></script>
    <script src="scripts/webcam.min.js"></script>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" 
      integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Dosis:300,400,600,700|Lora:400,400i,700">
    <link rel="stylesheet" href="style.css">
    <title>💩</title>
  </head>
  <body>
    <div class="container">
      <div class="col-md-4">
        <h2>Welcome</h2>
      </div>
      <div class="col-md-4 col-md-offset-4 text-right">
        <h3>Your Logo HERE!</h3>
      </div>
    </div>
    <div class="container">
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="row" ng-controller="RegisterController as register">
            <my-intro app-state="state" ng-show="state.showWelcome"></my-intro>
            <my-camera camera-stuff="cameraSettings" app-state="state"
              ng-show="state.showPictureScreen"></my-camera>
            <my-form info-data="info" ng-show="state.showCapture" app-state="state"
              capture-picture="capturePicture" camera-stuff="cameraSettings"></my-form>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>