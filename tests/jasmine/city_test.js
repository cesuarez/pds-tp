/*
'use strict';

describe("CityCtrl", function() {

    var scope, controller;

    beforeEach(angular.mock.module('tripsApp'));

    beforeEach(angular.mock.inject(function($controller, $rootScope, tripsFactory) {
        scope = $rootScope.$new();

        // Mapa para que use google maps
        var mapDiv = document.createElement("DIV");
        mapDiv.id = 'map-canvas';
        document.body.appendChild(mapDiv);

        // Metodos Mockeados del Service
        spyOn(tripsFactory, 'addCity').and.callFake(function() {
            scope.trip.cities = [
                {_id:1, location:[0,0]},
                {_id:2, location:[0,0]}
            ];
            return {
                then: function(callback) { callback() }
            };
        });

        spyOn(tripsFactory, 'deleteCity').and.callFake(function() {
            scope.trip.cities = [];
            return {
                then: function(callback) { callback() }
            };
        });

        var mockedTrip = {cities: [{_id:1, location:[0,0]}]}

        controller = $controller('CityCtrl', { 
            $scope: scope,
            tripsFactory: tripsFactory,
            trip: mockedTrip
        });
    }));


    it("deletes a city", function() {
        scope.removeCity();
        expect(scope.trip.cities).toEqual([]);
    });
    
    it("adds a city", function() {
        scope.validateCityForm = function() {
            scope.validCityForm = true;
        };
        scope.addCity();
        expect(scope.trip.cities).toEqual([
            {_id:1, location:[0,0]},
            {_id:2, location:[0,0]}
        ]);
    });
    
});
*/