'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('web-component-tester');

    // configurable paths
    var yeomanConfig = {
        app: './',
        dist: 'build'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: {liveCSS: false}
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '<%= yeoman.app %>/elements/{,*/}*.html',
                    '<%= yeoman.app %>/pages/{,*/}*.html',
                    '<%= yeoman.app %>/layouts/{,*/}*.html',
                    '{.tmp,<%= yeoman.app %>}/elements/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/css/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/js/{,*/}*.js',
                    '<%= yeoman.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            js: {
                files: ['<%= yeoman.app %>/js/{,*/}*.js'],
                tasks: ['jshint']
            },
            styles: {
                files: [
                    '<%= yeoman.app %>/css/{,*/}*.css',
                    '<%= yeoman.app %>/elements/{,*/}*.css'
                ],
                tasks: ['copy:styles', 'autoprefixer:server']
            },
            sass: {
                files: [
                    '<%= yeoman.app %>/css/{,*/}*.{scss,sass}',
                    '<%= yeoman.app %>/elements/{,*/}*.{scss,sass}'
                ],
                tasks: ['sass:server', 'autoprefixer:server']
            }
        },
        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: {
                sourceMap: true,
                includePaths: ['bower_components']
            },
            dist: {
                options: {
                    style: 'compressed'
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: ['css/{,*/}*.{scss,sass}', 'elements/{,*/}*.{scss,sass}'],
                    dest: '<%= yeoman.dist %>',
                    ext: '.css'
                }]
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: ['css/{,*/}*.{scss,sass}', 'elements/{,*/}*.{scss,sass}'],
                    dest: '.tmp',
                    ext: '.css'
                }]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '.tmp',
                    src: '**/*.css',
                    dest: '.tmp'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['**/*.css', '!bower_components/**/*.css'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    open: {
                        target: 'http://localhost:<%= connect.options.port %>/test'
                    },
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    },
                    keepalive: true
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                '<%= yeoman.app %>/js/{,*/}*.js',
                '!<%= yeoman.app %>/js/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/css/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>'],
                blockReplacements: {
                    vulcanized: function (block) {
                        return '<link rel="import" href="' + block.dest + '">';
                    }
                }
            }
        },
        vulcanize: {
            default: {
                options: {
                    strip: true
                },
                files: {
                    '<%= yeoman.dist %>/elements/elements.vulcanized.html': [
                        '<%= yeoman.dist %>/elements/elements.html'
                    ]
                }
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/img',
                    src: '{,*/}*.{png,jpg,jpeg,svg}',
                    dest: '<%= yeoman.dist %>/img'
                }]
            }
        },
        minifyHtml: {
            options: {
                quotes: true,
                empty: true
            },
            app: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.dist %>/pages',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>/pages'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.dist %>/layouts',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>/layouts'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        '*.html',
                        'elements/**',
                        'layouts/**',
                        'pages/**',
                        '!elements/**/*.scss',
                        'img/{,*/}*.{webp,gif}',
                        'bower_components/**'
                    ]
                }]
            },
            styles: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '.tmp',
                    src: ['{css,elements}/{,*/}*.css']
                }]
            }
        },
        'wct-test': {
            options: {
                root: '<%= yeoman.app %>'
            },
            local: {
                options: {remote: false}
            },
            remote: {
                options: {remote: true}
            }
        },
        // See this tutorial if you'd like to run PageSpeed
        // against localhost: http://www.jamescryer.com/2014/06/12/grunt-pagespeed-and-ngrok-locally-testing/
        pagespeed: {
            options: {
                // By default, we use the PageSpeed Insights
                // free (no API key) tier. You can use a Google
                // Developer API key if you have one. See
                // http://goo.gl/RkN0vE for info
                nokey: true
            },
            // Update `url` below to the public URL for your site
            mobile: {
                options: {
                    url: "https://developers.google.com/web/fundamentals/",
                    locale: "en_GB",
                    strategy: "mobile",
                    threshold: 80
                }
            }
        }
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'sass:server',
            'copy:styles',
            'autoprefixer:server',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('test', ['wct-test:local']);
    grunt.registerTask('test:browser', ['connect:test']);
    grunt.registerTask('test:remote', ['wct-test:remote']);

    grunt.registerTask('build', [
        'clean:dist',
        'sass',
        'copy',
        'useminPrepare',
        'imagemin',
        //'concat',
        'autoprefixer',
        //'uglify',
        'vulcanize',
        'usemin',
        'minifyHtml'
    ]);

    grunt.registerTask('default', [
        'jshint',
        // 'test'
        'build'
    ]);
};