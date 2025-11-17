const r=require("express").Router();const R=require("../models/Resource");const {auth,requireAdmin}=require("../middleware/auth");
r.get("/",async(req,res)=>res.json(await R.find()));
r.post("/",auth,requireAdmin,async(req,res)=>res.json(await R.create(req.body)));
r.put("/:id",auth,requireAdmin,async(req,res)=>res.json(await R.findByIdAndUpdate(req.params.id,req.body,{new:true})));
r.delete("/:id",auth,requireAdmin,async(req,res)=>res.json(await R.findByIdAndDelete(req.params.id)));
module.exports=r;