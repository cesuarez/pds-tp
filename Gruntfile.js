module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    karma: {
      unit: {
          configFile: 'karma.conf.js'
      },
      travis: {
          configFile: 'karma.conf.js',
          singleRun: true,
          browsers: ['Firefox']
      }
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
      all: ['Gruntfile.js', 'public/**/*.js']
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
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  //grunt.registerTask('default', ['uglify']);
  //grunt.registerTask('default', ['compile']);

  grunt.registerTask('jshint', 'jshint');

  grunt.registerTask('localTest', ['karma:unit']);
  grunt.registerTask('test', ['karma:travis'])

};