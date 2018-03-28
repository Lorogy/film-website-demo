var express=require('express')
var path=require('path')
var bodyParser=require('body-parser')
var serveStatic=require('serve-static')
var cookieParser=require('cookie-parser')
var session=require('express-session')
var morgan=require('morgan')
var mongoose=require('mongoose')
var mongoStore=require('connect-mongo')(session)
var fs=require('fs')
var dbUrl='mongodb://localhost/film'
var port=process.env.PORT||3000
var app=express()

mongoose.Promise = global.Promise
mongoose.connect(dbUrl, {
    useMongoClient: true
})
//连接本地数据库
var db = mongoose.connection
db.on('error', console.error.bind(console, 'Mongodb connect error !'))
db.once('open', function() {
    console.log('Mongodb started !')
})

//models loading
var models_path=__dirname+'/app/models'
var walk=function(path){
	fs
		.readdirSync(path)
		.forEach(function(file){
			var newPath=path+'/'+file
			var stat=fs.statSync(newPath)

			if(stat.isFile()){
				if(/(.*)\.(js|coffee)/.test(file)){
					require(newPath)
				}
			}
			else if(stat.isDirectory()){
				walk(newPath)
			}
		})
}
walk(models_path)

app.set('views','./app/views/pages/')
app.set('view engine','jade')
app.use(bodyParser.urlencoded({extended:true}))
app.use(serveStatic('public'))
app.use(cookieParser())
app.use(session({
	secret:'film',
	resave:false,
	saveUninitialized:true,
	//可有可无
	store: new mongoStore({
		url:dbUrl,
		collection:'sessions'
	})
}))
//app.use(multipart())
app.listen(port)
app.locals.moment=require('moment')

var env=process.env.NODE_ENV || 'development'
if('development'===env){
	app.set('showStackError',true)
	app.use(morgan(':method :url :status'))
	app.locals.pretty=true
	//mongoose.set('debug',true)
}

require('./config/routes')(app)

console.log('film website started on port '+port)
console.log('********************')

