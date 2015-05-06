module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
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

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-wiredep');

  // Default task(s).
  //grunt.registerTask('default', ['uglify']);
  //grunt.registerTask('default', ['compile']);

};