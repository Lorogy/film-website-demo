var express=require('express')
var path=require('path')
var _=require('underscore')
var bodyParser=require('body-parser')
var serveStatic=require('serve-static')
var mongoose=require('mongoose')

var Movie=require('./models/movie')


mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/film', {
    useMongoClient: true
})
var db = mongoose.connection
db.on('error', console.error.bind(console, 'Mongodb connect error !'))
db.once('open', function() {
    console.log('Mongodb started !')
})


var port=process.env.PORT||3000
var app=express()
app.set('views','./views/pages/')
app.set('view engine','jade')
app.use(bodyParser.urlencoded({extended:true}))
app.use(serveStatic('public'))
app.locals.moment=require('moment')
app.listen(port)

console.log('film website started on port '+port)

//index page
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}

		res.render('index',{
			title:'film 首页',
			movies:movies
		})
	})	
})

//detail page
app.get('/movie/:id',function(req,res){
	var id=req.params.id

	Movie.findById(id,function(err,movie){
		if(err){
			console.log(err)
		}

		res.render('detail',{
			title:'film '+movie.title,
			movie: movie
		})
	})	
})

//admin page
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'film 后台录入页',
		movie: {
			doctor: '',
			country: '',
			title: '',
			year: '',
			poster: '',
			language: '',
			flash: '',
			summary: ''
		}
	})
})

//admin update movie
app.get('/admin/update/:id',function(req,res){
	var id=req.params.id;

	Movie.findById(id,function(err,movie){
		if(err){
			console.log(err)
		}

		res.render('admin',{
			title:'film 后台更新页面',
			movie: movie
		})
	})	
})

//admin post movie
app.post('/admin/movie/new',function(req,res){	
	var movieObj=req.body.movie
	var id=movieObj._id
	var _movie

	if(id!=='undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}

			_movie=_.extend(movie,movieObj);
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}

				res.redirect('/movie/'+movie._id)
			})
		})
	}
	else{
		_movie=new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			poster:movieObj.poster,
			year:movieObj.year,
			country:movieObj.country,
			flash:movieObj.flash,
			summary:movieObj.summary,
			language:movieObj.language
		})
		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}

			res.redirect('/movie/'+movie._id)
		})
	}
})

//list page
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}

		res.render('list',{
			title:'film 列表页',
			movies:movies
		})
	})		
})

app.delete('/admin/list',function(req,res){
	var id=req.query.id;

	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}
			else{
				res.json({success:1})
			}
		})
	}
})