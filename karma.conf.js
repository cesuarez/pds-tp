// Karma configuration
// Generated on Sat Jun 20 2015 20:46:43 GMT-0300 (Hora estándar de Argentina)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false&language=es&v=3.17',
        'public/javascripts/lib/jquery/dist/jquery.js',
        'public/javascripts/lib/angular/angular.js',
        'public/javascripts/lib/angular-mocks/angular-mocks.js',
        'public/javascripts/lib/angular-ui-router/release/angular-ui-router.js',
        'public/javascripts/lib/bootstrap/dist/js/bootstrap.js',
        'public/javascripts/lib/moment/moment.js',
        'public/javascripts/lib/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
        'public/javascripts/lib/ngmap/build/scripts/ng-map.js',
        'public/javascripts/lib/fullcalendar/dist/fullcalendar.js',
        'public/javascripts/angularApp.js',
        'public/javascripts/controllers/*.js',
        'public/javascripts/services/*.js',
        'tests/*.js'
    ],

    plugins : [
        'karma-jasmine',
        'karma-phantomjs-launcher'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],//, 'PhantomJS_custom'],
    /*
    // you can define custom flags
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          },
        },
        flags: ['--load-images=true'],
        debug: true
      }
    },
    */
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
