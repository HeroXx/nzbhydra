angular
    .module('nzbhydraApp')
    .directive('hydraupdates', hydraupdates);

function hydraupdates() {
    return {
        templateUrl: 'static/html/directives/updates.html',
        controller: controller
    };

    function controller($scope, UpdateService, $sce) {

        $scope.loadingPromise = UpdateService.getVersions().then(function (data) {
            $scope.currentVersion = data.data.currentVersion;
            $scope.repVersion = data.data.repVersion;
            $scope.updateAvailable = data.data.updateAvailable;
            if ($scope.repVersion > $scope.currentVersion) {
                UpdateService.getChangelog().then(function(data) {
                    $scope.changelog = data.data.changelog;
                })
            }
        });
        
        UpdateService.getVersionHistory().then(function(data) {
            $scope.versionHistory = $sce.trustAsHtml(data.data.versionHistory);
        });

        $scope.update = function () {
            UpdateService.update();
        };

        $scope.showChangelog = function () {
            UpdateService.showChanges($scope.changelog);
        };
        
        

    }
}

