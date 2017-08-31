var User=require('../models/user')

//signup
exports.signup=function(req,res){
	var _user=req.body.user

	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}

		if(user){
			return res.redirect('/signin')
		}
		else{
			var user=new User(_user)

			user.save(function(err,user){
				if(err){
					console.log(err)
				}

				res.redirect('/')
			})			
		}
	})


	// req.params/.body/.query
	// /user/signup/1111?user=1112
	// {user:1113}
	// 1111-->params
	// 1112-->query
	// 1113-->body
}

exports.showSignup=function(req,res){
	res.render('signup',{
		title:'注册页面'
	})
}

//signin
exports.signin=function(req,res){
	var _user=req.body.user
	var name=_user.name
	var password=_user.password

	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err)
		}

		if(!user){
			return res.redirect('/signup')
		}

		user.comparePassWord(password,function(err,isMatch){
			if(err){
				console.log(err)
			}

			if(isMatch){
				req.session.user=user

				return res.redirect('/')
			}			
			else{
				return res.redirect('/signin')
			}
		})
	})
}

exports.showSignin=function(req,res){
	res.render('signin',{
		title:'登录页面'
	})
}

//logout
exports.logout=function(req,res){
	delete req.session.user
	//delete app.locals.user

	res.redirect('/')
}

//userlist page
exports.list=function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}

		res.render('userlist',{
			title:'film 用户列表页',
			users:users
		})
	})	
		
}

//midware for user 
exports.signinRequired=function(req,res,next){
	var user=req.session.user

	if(!user){
		return res.redirect('/signin')
	}

	next()		
}

exports.adminRequired=function(req,res,next){
	var user=req.session.user

	if(user.role<=10){
		return res.redirect('/signin')
	}

	next()		
}