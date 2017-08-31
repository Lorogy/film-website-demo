var Movie=require('../models/movie')
var _=require('underscore')

//detail page
exports.detail=function(req,res){
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
}

//admin page
exports.new=function(req,res){
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
}

//admin update movie
exports.update=function(req,res){
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
}

//admin post movie
exports.save=function(req,res){	
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
}

//list page
exports.list=function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}

		res.render('list',{
			title:'film 列表页',
			movies:movies
		})
	})		
}

exports.del=function(req,res){
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
}