var mongoose=require('mongoose')
var Schema=mongoose.Schema
var ObjectId=Schema.Types.ObjectId

var MovieSchema=new Schema({
	doctor:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	pv:{
		type:Number,
		default:0
	},
	category:{
		type:ObjectId,
		ref:'Category'
	},
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

//每次存取数据前调用的方法，若数据为新，保存创建时间与更新时间；否则只修改更新时间
MovieSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now()
	}
	else{
		this.meta.updateAt=Date.now()
	}

	next()
})

//静态方法，必须实例化才能生效
MovieSchema.statics={
	//取出数据库所有数据，按更新时间排序
	fetch: function(cb){
		return this.find({}).sort('meta.updateAt').exec(cb)
	},
	//取出单条数据
	findById:function(id,cb){
		return this.findOne({_id:id}).exec(cb)
	}
}

//导出模式
module.exports=MovieSchema