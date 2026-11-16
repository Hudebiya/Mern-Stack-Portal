import jwt from "jsonwebtoken";
import userModel from "../models/users.model.js";

export async function authenticateToken(req,res,next){
    const authorization = req.get("Authorization");
    const bearerToken = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];
    const token = bearerToken || req.cookies?.token;

    if(!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await userModel.findById(decoded.id).select("-password")
        if(!user){
            return res.status(401).json({ message: "User not found" })
        }
        if(user.isActive === false){
            return res.status(403).json({ message: "Account is deactivated" })
        }
        req.user = {
            id: user._id.toString(),
            role: user.role,
            username: user.username,
            email: user.email
        }
        next()
    }catch(err){
        res.status(401).json({
            message:"Invalid Token",
            err: err.message
        })
    }
}

export function requireAdmin(req,res,next){
    if( req.user.role !== "admin"){
        return res.status(403).json({
            message:"Forbidden"
        })
    }
    next()
}

export function authorizeRoles(...roles){
    return (req,res,next)=>{
        if(!req.user || !roles.includes(req.user.role)){
            return res.status(403).json({ message: "Forbidden" })
        }
        next()
    }
}