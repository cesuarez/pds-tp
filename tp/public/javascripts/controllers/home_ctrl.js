angular.module('tripsApp').controller('HomeCtrl', ['$scope', 'tripsFactory', function($scope, tripsFactory){

    $scope.trips = tripsFactory.trips;

    $scope.displayDeletePopup = false;

    $scope.addTrip = function(){
        if($scope.name !== '' && $scope.name !== undefined) {
            tripsFactory.create({
                name: $scope.name,
                initDate: $scope.initDate,
                endDate: $scope.endDate
            });
            $scope.name = '';
            $scope.initDate = null;
            $scope.endDate = null;
        }
    };

    $scope.removeTrip = function(){
        tripsFactory.delete($scope.tripToRemove);
        $scope.showDeletePopup(false);
    }

    $scope.prepareForDelete = function(id){
        console.log("BORRO: " + id);
        $scope.tripToRemove = id;
        $scope.showDeletePopup(true);
    }

    $scope.showDeletePopup = function(bool) {
        $scope.displayDeletePopup = bool;   
    }

}]);

/*
// Confirm Directive
angular.module('tripsApp').directive('ngReallyClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);
*/