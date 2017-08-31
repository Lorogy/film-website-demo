var express=require('express')
var path=require('path')
var bodyParser=require('body-parser')
var serveStatic=require('serve-static')
var cookieParser=require('cookie-parser')
var session=require('express-session')
var morgan=require('morgan')
var mongoose=require('mongoose')
var mongoStore=require('connect-mongo')(session)

var dbUrl='mongodb://localhost/film'
var port=process.env.PORT||3000
var app=express()

mongoose.Promise = global.Promise
mongoose.connect(dbUrl, {
    useMongoClient: true
})
var db = mongoose.connection
db.on('error', console.error.bind(console, 'Mongodb connect error !'))
db.once('open', function() {
    console.log('Mongodb started !')
})

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
app.listen(port)
app.locals.moment=require('moment')

if('development'===app.get('env')){
	app.set('showStackError',true)
	app.use(morgan(':method :url :status'))
	app.locals.pretty=true
	mongoose.set('debug',true)
}

require('./config/routes')(app)

console.log('film website started on port '+port)

