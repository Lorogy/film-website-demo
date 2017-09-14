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

		concurrent:{
			target:{
				tasks:['watch','nodemon'],
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