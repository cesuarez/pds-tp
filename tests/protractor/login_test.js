describe('LoginCtrl', function() {

    beforeEach(function() {
	    browser.get('http://localhost:3000/#/login');
	    element(by.model('user.username')).sendKeys('protractor');
	    element(by.model('user.password')).sendKeys('protractor');
	    element(by.id('logIn')).click();
  	});
    

    afterEach(function() {
    	element(by.id('logOut')).click();
  	});


	it('should have a title', function() {   
		expect(browser.getTitle()).toEqual('Viajes');
	});
     

    it('should log in', function() {
		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/home');
	});
/*
	it('should create trip', function() {
	    element(by.model('trip.name')).sendKeys('Alemania');
	    element(by.model('trip.initDate')).sendKeys(new Date('02/02/2016'));
	    element(by.model('trip.endDate')).sendKeys(new Date('02/03/2016'));
	    element(by.model('trip.initDate')).getAttribute('value').then(function(value){ console.log(value)});
	    element(by.id('createTrip')).click();
	});


	it('should create city', function() {
		element(by.id('trip_0')).click();

		element(by.model('city.days')).sendKeys('1');

		var request = {
		  placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
		};

		service = new google.maps.places.PlacesService(map);
		service.getDetails(request, callback);

		function callback(place, status) {
		    if (status == google.maps.places.PlacesServiceStatus.OK) {
		        element(by.model('city.cityNameAuto')).sendKeys(place.name);
		        element(by.model('city.location')).sendKeys(createLocation(place.geometry.location));
		    }
		}

		element(by.id('addCity')).click();

	});
*/

});