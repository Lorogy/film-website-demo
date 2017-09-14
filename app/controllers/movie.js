var Movie=require('../models/movie')
var Comment=require('../models/comment')
var Category=require('../models/category')
var _=require('underscore')

//detail page
exports.detail=function(req,res){
	var id=req.params.id

	/*Movie.findById(id,function(err,movie){
		Comment.find({movie:id},function(err,comments){
			res.render('detail',{
				title:'film '+movie.title,
				movie: movie,
				comments:comments
			})
		})*/

	Movie.findById(id,function(err,movie){
		if(err){
			console.log(err)
		}

		Comment
			.find({movie:id})
			.populate('from','name')
			.populate('reply.from reply.to','name')
			.exec(function(err,comments){
				if(err){
					console.log(err)
				}

				res.render('detail',{
					title:'film '+movie.title,
					movie: movie,
					comments:comments
				})
		})		
	})	
}

//admin page
exports.new=function(req,res){
	Category.find({},function(err,categories){
		res.render('admin',{
			title:'film 后台录入页',
			categories:categories,
			movie: {}
		})
	})	
}

//admin update movie
exports.update=function(req,res){
	var id=req.params.id;

	if(id){
		Movie.findById(id,function(err,movie){
			Category.find({},function(err,categories){
				res.render('admin',{
					title:'film 后台更新页面',
					movie: movie,
					categories:categories
				})
			})	
		})	
	}
}

//admin post movie
exports.save=function(req,res){	
	var movieObj=req.body.movie
	var id=movieObj._id
	var _movie

	if(id){
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
		_movie=new Movie(movieObj)

		var categoryId=movieObj.category
		var categoryName=movieObj.categoryName

		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}

			if(categoryId){
				Category.findById(categoryId,function(err,category){
					category.movies.push(movie._id)

					category.save(function(err,category){
						res.redirect('/movie/'+movie._id)
					})
				})
			}	
			else if(categoryName){
				var category=new Category({
					name:categoryName,
					movies:[movie._id]
				})	

				category.save(function(err,category){
					movie.category=category._id
					movie.save(function(err,movie){
						res.redirect('/movie/'+movie._id)
					})	
				})			
			}	
			else{
				// var category=new Category({
				// 	name:"其他",
				// 	movies:[movie._id]
				// })

				// category.save(function(err,category){
				// 	movie.category=category._id
				// 	movie.save(function(err,movie){
				// 		res.redirect('/movie/'+movie._id)
				// 	})	
				// })	
			}				
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