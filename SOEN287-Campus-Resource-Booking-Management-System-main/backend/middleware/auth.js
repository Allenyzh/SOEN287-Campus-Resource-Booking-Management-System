const jwt=require("jsonwebtoken");const User=require("../models/User");
const auth=async(req,res,next)=>{const h=req.headers.authorization;if(!h)return res.status(401).json({msg:"No token"});try{const t=h.split(" ")[1];const d=jwt.verify(t,process.env.JWT_SECRET);req.user=await User.findById(d.id);next();}catch(e){res.status(401).json({msg:"Invalid"});}};
const requireAdmin=(req,res,next)=>req.user.role!=="admin"?res.status(403).json({msg:"Admin only"}):next();
module.exports={auth,requireAdmin};