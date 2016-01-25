'use strict';

angular.module('imageEditorApp')
    .controller('MainCtrl', function ($scope) {


        $scope.setImageFile = function (element) {
            //$scope.init();
            if (element.files && element.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $scope.image.src = e.target.result;
                };

                reader.readAsDataURL(element.files[0]);
            }
            $scope.image.onload = $scope.resetImage;
        };

        $scope.init = function () {
            $scope.canvas = angular.element("#myCanvas")[0];
            $scope.ctx = $scope.canvas.getContext("2d");
            $scope.image = new Image();
            $scope.vignImage = new Image();

            $scope.bright = 0;
            $scope.contrast = 1;
            $scope.strength = 1;
            $scope.color = {
                red: 255,
                green: 189,
                blue: 10
            };
            $scope.autocontrast = false;
            $scope.vignette = false;

        };


        $scope.init();

        $scope.resetImage = function () {
            $scope.canvas.width = $scope.image.width;
            $scope.canvas.height = $scope.image.height;
            $scope.ctx.drawImage($scope.image, 0, 0, $scope.image.width, $scope.image.height);

                $scope.vignImage.onload = resetVign;
                $scope.vignImage.src = "images/vignette.jpg"  
        };

        $scope.manipulate = function () {

            $scope.resetImage();
            $scope.imageData = $scope.ctx.getImageData(0, 0, $scope.image.width, $scope.image.height);
            $scope.pixels = $scope.imageData.data;
            setBright();
            setContrast();
            tint();
            if($scope.vignette){
            setVign();}


            $scope.ctx.clearRect(0, 0, $scope.image.width, $scope.image.height);
            $scope.ctx.putImageData($scope.imageData, 0, 0);
            
        };

        var resetVign = function () {
            var cn = document.createElement('canvas');
            cn.height = $scope.image.height;
            cn.width = $scope.image.width;
           
            var ctx = cn.getContext("2d");
            
            ctx.drawImage($scope.vignImage, 0, 0, $scope.image.width, $scope.image.height);
            $scope.vignData = ctx.getImageData(0, 0, cn.width, cn.height);
            $scope.vignPixels = $scope.vignData.data;



        };
        
        var setBright = function () {
            for (var i = 0; i < ($scope.image.width * $scope.image.height); i++) {
                $scope.pixels[i * 4] += parseInt($scope.bright);
                $scope.pixels[i * 4 + 1] += parseInt($scope.bright);
                $scope.pixels[i * 4 + 2] += parseInt($scope.bright);
            };
        };
        
        var setContrast = function () {
            for (var i = 0; i < ($scope.image.width * $scope.image.height); i++) {
                $scope.pixels[i * 4] = (((((parseFloat($scope.pixels[i * 4]) / 255.0) - 0.5) * $scope.contrast) + 0.5) * 255.0);
                $scope.pixels[i * 4 + 1] = (((((parseFloat($scope.pixels[i * 4 + 1]) / 255.0) - 0.5) * $scope.contrast) + 0.5) * 255.0);
                $scope.pixels[i * 4 + 2] = (((((parseFloat($scope.pixels[i * 4 + 2]) / 255.0) - 0.5) * $scope.contrast) + 0.5) * 255.0);
            };
        };

       
        var tint = function () {
            for (var i = 0; i < ($scope.image.width * $scope.image.height); i++) {
                $scope.pixels[i * 4] += parseFloat(parseInt($scope.color.red) * ($scope.strength / 100));
                $scope.pixels[i * 4 + 1] += parseFloat(parseInt($scope.color.green) * ($scope.strength / 100));
                $scope.pixels[i * 4 + 2] += parseFloat(parseInt($scope.color.blue) * ($scope.strength / 100));
            };
        };


       
        var setVign = function () {
            for (var i = 0; i < ($scope.image.width * $scope.image.height); i++) {
                $scope.pixels[i * 4] = parseFloat($scope.pixels[i * 4] * $scope.vignPixels[i * 4] / 255);
                $scope.pixels[i * 4 + 1] = parseFloat($scope.pixels[i * 4 + 1] * $scope.vignPixels[i * 4 + 1] / 255);
                $scope.pixels[i * 4 + 2] = parseFloat($scope.pixels[i * 4 + 2] * $scope.vignPixels[i * 4 + 2] / 255);
            };
        }
        $scope.saveImage = function(){
            var imgAsDataUrl =$scope.canvas.toDataURL('image/png');
            $scope.url = imgAsDataUrl;
        };


    }).config(function($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|coui|data):/);
    
});