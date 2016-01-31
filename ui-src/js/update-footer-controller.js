angular
    .module('nzbhydraApp')
    .controller('UpdateFooterController', UpdateFooterController);

function UpdateFooterController($scope, UpdateService) {

    $scope.updateAvailable = false;
    
    UpdateService.getVersions().then(function(data) {
        $scope.currentVersion = data.data.currentVersion;
        $scope.repVersion = data.data.repVersion;
        $scope.updateAvailable = data.data.updateAvailable;
        $scope.changelog = data.data.changelog; 
    });
    

    $scope.update = function () {
        UpdateService.update();
    };

    $scope.showChangelog = function () {
        UpdateService.showChanges($scope.changelog);
    }

}
