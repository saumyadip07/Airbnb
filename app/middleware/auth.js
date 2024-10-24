const User=require("../module/user/user.model.js")
const Admin=require("../module/admin/admin.model.js")
const Vendor=require("../module/vendor/vendor.model.js")
const Hotel=require("../module/hotel/hotel.model.js")
const jwt=require("jsonwebtoken")
const { error } = require("../module/hotel/hotel.validation.js")




const verifyUserToken=async(req,res,next)=>{
    try {
        const token = req.cookies?.UserToken || req.headers["authorization"];
        
        console.log(token);
        if (!token) {
            return res.status(401).json({message:"Unauthorized request"})
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_USER_SECRET)
    
        const user = await User.findById(decodedToken?.userId).select("-password ")
    
        if (!user) {
            
            return res.status(401).json({message:"Invalid Access Token"})
        }
    
        req.user = decodedToken;
        req.userView=user;
        next()
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message:error?.message
        })
    }
}

const verifyAdminToken=async(req,res,next)=>{
    try {
        const token = req.cookies?.AdminToken || req.headers["Authorization"];
        
        console.log(token);
        if (!token) {
            return res.status(401).json({message:"Unauthorized request"})
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_ADMIN_SECRET)
        // console.log("DecodedToken",decodedToken)
    
        const admin = await Admin.findById(decodedToken?.adminId).select("-password ")

        // console.log("admin in auth",admin)
        
        if (!admin) {
            
            return res.status(401).json({message:"Invalid Access Token"})
        }
    
        req.user = decodedToken;
        req.userView=admin;
        next()
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message:error?.message
        })
    }
}


const verifyVendorToken=async(req,res,next)=>{
    try {
        const token = req.cookies?.VendorToken ||
         req.headers["authorization"];
        
        // console.log(token);
        if (!token) {
            return res.status(401).json({message:"Token Unauthorized request"})
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_VENDOR_SECRET)
        console.log("decodedtoken",decodedToken)
        const vendor = await Vendor.findById(decodedToken?.vendorId).select("-password ")
    
        if (!vendor) {
            
            return res.status(401).json({message:"Invalid Access Token"})
        }
    
        req.user = decodedToken;
        req.userView=vendor;
        next()
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message:error?.message
        })
    }
}

const isVendor=async(req,res,next)=>{
    const role=req.user?.role

    console.log(role);
    
    if(role==="vendor"){
        next()
    }else{
        return res.status(401).json({message:"isVendor Unauthorized request"})
    }
}

const isSameVendor=async(req,res,next)=>{
    const {id}=req.params
    const hotel=await Hotel.findById(id)
    console.log("Hotel",hotel)
    const vendorIdFromHotel=hotel?.vendorId.toString()
    console.log("vendorIdFromHotel",vendorIdFromHotel)
    const vendorId=req.user?.vendorId.toString()
    console.log("vendorId",vendorId)

    if(vendorId===vendorIdFromHotel){
        next()
    }else{
        return res.status(401).json({message:"isSameVendor Unauthorized request"})
    }
}


module.exports={verifyUserToken,verifyAdminToken,verifyVendorToken,isVendor,isSameVendor}


