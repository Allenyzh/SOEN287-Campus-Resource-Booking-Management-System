const r=require("express").Router();const B=require("../models/Booking");const R=require("../models/Resource");const {auth}=require("../middleware/auth");
const overlap=(a,b,c,d)=>a<d&&b>c;
r.post("/",auth,async(req,res)=>{const{resourceId,startTime,endTime,purpose}=req.body;const start=new Date(startTime),end=new Date(endTime);const ex=await B.find({resource:resourceId,status:{$in:["pending","approved"]}});if(ex.some(b=>overlap(start,end,b.startTime,b.endTime)))return res.status(409).json({msg:"Conflict"});const bk=await B.create({user:req.user._id,resource:resourceId,startTime:start,endTime:end,purpose});res.json(bk);});
r.get("/me",auth,async(req,res)=>res.json(await B.find({user:req.user._id}).populate("resource")));
module.exports=r;