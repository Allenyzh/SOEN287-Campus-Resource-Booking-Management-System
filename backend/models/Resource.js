const mongoose=require("mongoose");
const resourceSchema=new mongoose.Schema({name:String,type:String,location:String,capacity:Number,description:String,images:[String],isBlocked:{type:Boolean,default:false}},{timestamps:true});
module.exports=mongoose.model("Resource",resourceSchema);