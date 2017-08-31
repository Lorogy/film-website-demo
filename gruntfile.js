module.exports=function(grunt){
	grunt.initConfig({
		watch:{
			jade:{
				files:['views/**'],
				options:{
					livereload:true
				}
			},
			js:{
				files:['public/js/**','models/**/*.js','schemas/**/*.js'],
				//tasks:['jsint'],
				options:{
					livereload:true
				}
			}
		},

		nodemon:{
			dev:{
				script:'app.js',
				options:{
					args:['dev'],//args:[]
					nodeArgs: ['--debug'],
					ignore:['README.md','node_modules/**','.DS_Store'],
					watch:['./'],
					delay:1000,
					env:{
						PORT:'3000'
					},
					cwd:__dirname
				}
			}
		},

		concurrent:{
			target:{
				tasks:['nodemon','watch'],
				options:{
					logConcurrentOutput:true
				}
			}		
		}
	})

	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-nodemon')
	grunt.loadNpmTasks('grunt-concurrent')

	grunt.option('force',true)
	grunt.registerTask('default',['concurrent:target'])
}