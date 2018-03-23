module.exports=function(grunt){
	grunt.initConfig({
		watch:{
			jade:{
				files:['app/views/**'],
				options:{
					livereload:true
				}
			},
			js:{
				files:['public/js/*.js','app/models/*.js','app/schemas/*.js','app/controllers/*.js','config/*.js','app.js'],
				//tasks:['jsint'],
				options:{
					livereload:true
				}
			},
      uglify: {
        files: ['public/**/*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      styles: {
        files: ['public/**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['public/libs/**/*.js']
      },
      all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
    },

    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          'public/build/index.css': 'public/less/index.less'
        }
      }
    },

    uglify: {
      development: {
        files: {
          'public/build/admin.min.js': 'public/js/admin.js',
          'public/build/detail.min.js': [
            'public/js/detail.js'
          ]
        }
      }
		},

		nodemon:{
			dev:{
				script:'./app.js',
				options:{
					args:['dev'],//args:[]
					nodeArgs: ['--debug'],
					ignore:['README.md','node_modules/**','.DS_Store'],
					watch:['./'],
					legacyWatch: true,
					delay:1000,
					env:{
						PORT:'3000'
					},
					cwd:__dirname
				 }
			}
		},

		mochaTest:{
			options:{
				reporter:'spec'
			},
			src:['test/**/*.js']
		},

		concurrent:{
			target:{
				tasks:['nodemon', 'watch', 'less', 'uglify', 'jshint'],
				options:{
					logConcurrentOutput:true
				}
			}		
		}
	})

	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-nodemon')
	grunt.loadNpmTasks('grunt-concurrent')
	grunt.loadNpmTasks('grunt-mocha-test')
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-jshint')

	grunt.option('force',true)
	grunt.registerTask('default',['concurrent:target'])
	grunt.registerTask('test',['mochaTest'])
}