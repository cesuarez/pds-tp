module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    karma: {
      unit: {
          configFile: 'karma.conf.js'
      },
      unix: {
        configFile: 'karma.conf.js',
        browsers: ['Firefox']
      },
      travis: {
          configFile: 'karma.conf.js',
          singleRun: true,
          browsers: ['Firefox']
      }
    },

    protractor: {
      options: {
        configFile: "protractor.conf.js", // Default config file 
        keepAlive: true, // If false, the grunt process stops when the test fails. 
        noColor: false, // If true, protractor will not use colors in its output. 
        args: {
          // Arguments passed to the command 
        }
      },
      your_target: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too. 
        options: {
          configFile: "protractor.conf.js", // Target-specific config file 
          args: {} // Target-specific arguments 
        }
      },
    },

    
    //watch: {
    //    karma: {
    //        files: ['src/**/*.js', 'test/unit/**/*.js'],
    //        tasks: ['karma:unit:run']
    //    }
    //},

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    
    jshint: {
      controllers: ['Gruntfile.js', 'public/javascripts/controllers/**/*.js'],
      services: ['Gruntfile.js', 'public/javascripts/services/**/*.js']
    },
    
    wiredep: {
      task: {
        src: ['views/**/*.ejs']
      },
      options : {
       ignorePath : "../public" 
      }
    },
    compile: {
      html: ['jade', 'wiredep'],
      styles: ['concat:styles', 'sass', 'clean:compile'],
      js: ['concat:js']
    }
  });

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-protractor-runner');

  // Default task(s).
  //grunt.registerTask('default', ['uglify']);
  //grunt.registerTask('default', ['compile']);

  grunt.registerTask('localTest', ['karma:unit']);
  grunt.registerTask('unixTest', ['karma:unix']);
  grunt.registerTask('test', ['karma:travis']);
  grunt.registerTask('default', 'jshint');

};