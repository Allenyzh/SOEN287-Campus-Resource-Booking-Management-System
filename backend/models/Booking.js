const mongoose=require("mongoose");
const bookingSchema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},resource:{type:mongoose.Schema.Types.ObjectId,ref:"Resource"},startTime:Date,endTime:Date,status:{type:String,default:"pending"},purpose:String},{timestamps:true});
module.exports=mongoose.model("Booking",bookingSchema);