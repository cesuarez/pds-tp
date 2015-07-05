angular.module('tripsApp').controller('HomeCtrl', ['$scope', '$location', 'tripsFactory', 
    function($scope, $location, tripsFactory){

    $scope.trips = tripsFactory.trips;

    $scope.displayDeletePopup = false;
    $scope.trip = {};
    $scope.validTripForm = null;

    $scope.resetTrip = function(){
        $scope.trip.name = '';
        $scope.trip.initDate = null;
        $scope.trip.endDate = null;
        $scope.validTripForm = null;
    };

    $scope.addTrip = function(){
        $scope.validateTripForm();
        if($scope.validTripForm) {
            tripsFactory.create({
                name: $scope.trip.name,
                initDate: $scope.trip.initDate,
                endDate: $scope.trip.endDate
            }).then(function() {
                $scope.resetTrip();
            });
        }
    };

    $scope.removeTrip = function(){
        tripsFactory.delete($scope.tripToRemove);
        $scope.showDeletePopup(false);
    };

    $scope.prepareForDelete = function(id){
        $scope.tripToRemove = id;
        $scope.showDeletePopup(true);
    };

    $scope.showDeletePopup = function(bool) {
        $scope.displayDeletePopup = bool;
    };

    $scope.validName = function() {
        if (!$scope.trip.name){
            $scope.nameErrors = "Ingrese un nombre";
            return false;
        } else if ($scope.trips.filter(function(trip) {return trip.name == $scope.trip.name;}).length > 0) {
            $scope.nameErrors = "El nombre ya existe";
            return false;
        } else {
            $scope.nameErrors = "";
            return true;
        }
    };

    $scope.validDate = function(date, errorsName) {
        if (!date){
            $scope[errorsName] = "Ingrese una fecha";
            return false;
        } else {
            $scope[errorsName] = "";
            return true;
        }
    };

    $scope.validTimeInterval = function() {
        if (!$scope.initDateErrors && !$scope.endDateErrors) {
            if ($scope.trip.initDate > $scope.trip.endDate){
                $scope.endDateErrors = "La fecha de llegada es menor que la de salida"
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    };

    $scope.tripClicked = function(trip){
        $location.path('/trips/' + trip._id)
    };

    $scope.validDates = function() {
        $scope.validDate($scope.trip.initDate, "initDateErrors");
        $scope.validDate($scope.trip.endDate, "endDateErrors");
        return $scope.validTimeInterval();
    };

    $scope.validateTripForm = function(){
        $scope.validTripForm = $scope.validName();
        $scope.validTripForm = $scope.validDates() && $scope.validTripForm;
    };

}]);