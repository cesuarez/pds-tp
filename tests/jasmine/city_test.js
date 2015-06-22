
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
        
        spyOn(tripsFactory, 'updateHotel').and.callFake(function() {
            scope.city.hotel = {_id:2};
            return {
                then: function(callback) { callback() }
            };
        });

        spyOn(tripsFactory, 'createHotel').and.callFake(function() {
            scope.city.hotel = {_id:1};
            return {
                then: function(callback) { callback() }
            };
        });
        
        spyOn(tripsFactory, 'deletePlace').and.callFake(function() {
            scope.city.places = [];
        });

        var mockedCity = {
            _id: 1,
            location: [0,0],
            places: [{_id:1, location:[0,0]}]
        };
        var mockedTrip = {cities: [mockedCity]};

        controller = $controller('CityCtrl', { 
            $scope: scope,
            tripsFactory: tripsFactory,
            city: mockedCity,
            trip: mockedTrip
        });
    }));


    it("deletes a place", function() {
        scope.deletePlace(1);
        expect(scope.city.places).toEqual([]);
    });
    
    it("updates a hotel", function() {
        scope.city.hotel = {_id:1};
        scope.saveHotel();
        expect(scope.city.hotel).toEqual({_id:2});
    });
    
    it("creates a hotel", function() {
        scope.saveHotel();
        expect(scope.city.hotel).toEqual({_id:1});
    });
    
    
});
