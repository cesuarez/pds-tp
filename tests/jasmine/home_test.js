'use strict';

describe("HomeCtrl", function() {

    var scope, controller;//, mockTripsFactory;

    /*
    beforeEach(angular.mock.module('tripsApp', function ($provide) {
        mockTripsFactory = {
            trips: [{_id:1},{_id:2},{_id:3}],
            delete: function(trip){
                scope.trips = [{_id:1},{_id:2}];
            },
            create: function(trip){
                scope.trips = [{_id:1},{_id:2},{_id:3},{_id:4}];
                return {
                    then: function(callback) { callback() }
                };
            },
        };
        $provide.value('tripsFactory', mockTripsFactory);
    }));
    */

    beforeEach(angular.mock.module('tripsApp'));

    beforeEach(angular.mock.inject(function($controller, $rootScope, tripsFactory) {
        scope = $rootScope.$new();

        // Metodos Mockeados del Service
        spyOn(tripsFactory, 'delete').and.callFake(function() {
            scope.trips = [{_id:1},{_id:2}];
        });
        spyOn(tripsFactory, 'create').and.callFake(function() {
            scope.trips = [{_id:1},{_id:2},{_id:3},{_id:4}];
            return {
                then: function(callback) { callback() }
            };
        });

        controller = $controller('HomeCtrl', { $scope: scope, tripsFactory: tripsFactory});
    }));

    it("deletes a trip", function() {
        scope.removeTrip({_id:3});
        expect(scope.trips).toEqual([{_id:1},{_id:2}]);
    });
    
    it("adds a trip", function() {
        scope.validateTripForm = function() {
            scope.validTripForm = true;
        };
        scope.addTrip();
        expect(scope.trips).toEqual([{_id:1},{_id:2},{_id:3},{_id:4}]);
    });
    
});