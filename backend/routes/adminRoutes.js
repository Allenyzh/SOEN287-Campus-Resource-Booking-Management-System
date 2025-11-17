const r=require("express").Router();const {auth,requireAdmin}=require("../middleware/auth");const B=require("../models/Booking");
r.get("/bookings",auth,requireAdmin,async(req,res)=>res.json(await B.find().populate("user").populate("resource")));
r.post("/bookings/:id/approve",auth,requireAdmin,async(req,res)=>{const b=await B.findById(req.params.id);b.status="approved";await b.save();res.json(b);});
r.post("/bookings/:id/reject",auth,requireAdmin,async(req,res)=>{const b=await B.findById(req.params.id);b.status="rejected";await b.save();res.json(b);});
module.exports=r;