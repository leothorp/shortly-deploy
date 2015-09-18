module.exports = function(grunt) {

  grunt.initConfig({
    //lets us access version numbers, other info
    pkg: grunt.file.readJSON('package.json'),
    // concat : {
    //   options{
    //     separator: ';'
    //   },
    //   dist: {
    //     src: ['public/client/**/*.js'],
    //     dest: 'public/dist/<% pkg.name %>.js'
    //   }
    // }
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'index.js'
      }
    },

    uglify: {
      dist: {
        src: [
            'public/lib/jquery.js',
            'public/lib/underscore.js',
            'public/lib/backbone.js',
            'public/lib/handlebars.js'
        ],
        dest: 'public/dist/lib.min.js'
      },
      dist2: {
        src: [
            'public/client/*.js',
        ],
        dest: 'public/dist/client.min.js'
      },
    },

    cssmin: {
      dist: {
        src: [
            'public/style.css'
        ],
        dest: 'public/dist/style.min.css'
      }
    },

    jshint: {
      files: [
        'app/**/*.js',
        'lib/*.js',
        'public/client/*.js',
        'index.js',
        'server.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push heroku master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', ['mochaTest']);

  grunt.registerTask('build', []);

  grunt.registerTask('deploy', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run([ 'shell:prodServer' ]);
    } else {
      grunt.task.run([ 'runTasks', 'server-dev']);
      //grunt.task.run(['server-dev']);
    }
  });

//could use postinstall in our package.json instead
  grunt.registerTask('heroku:production', 'runTasks');
  grunt.registerTask('heroku:development', '');

  grunt.registerTask('runTasks', [
    // add your deploy tasks here
    'jshint',
    'test',
    'uglify',
    'cssmin'
  ]);


};
