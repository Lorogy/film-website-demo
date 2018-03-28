var mongoose=require('mongoose')
var MovieSchema=require('../schemas/movie')
var Movie=mongoose.model('Movie',MovieSchema)//编译生成模型

module.exports=Movie//导出构造函数