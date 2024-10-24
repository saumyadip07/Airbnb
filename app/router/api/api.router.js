const express=require("express")
const UserController=require("../../module/webservice/user.controller")
const AdminController=require("../../module/webservice/admin.controller")
const VendorController=require("../../module/webservice/vendor.controller")
const HotelController=require("../../module/webservice/hotel.controller")
const upload=require("../../helper/multer")
const {verifyUserToken,verifyAdminToken,verifyVendorToken,isVendor,isSameVendor}=require("../../middleware/auth")

const apiRouter=express.Router()

//user
apiRouter.post("/user/signup",upload.single("userImage"),UserController.usersignup)
apiRouter.get("/auth/confirmation/:email/:token", UserController.confirmation);
apiRouter.post("/user/login",UserController.userlogin)
//booking
apiRouter.post("/booking/create/:id",verifyUserToken,UserController.bookingcreate)

//admin
apiRouter.post("/admin/signup",upload.single("adminImage"),AdminController.adminsignup)
apiRouter.post("/admin/login",AdminController.adminlogin)

//vendor
apiRouter.post("/vendor/signup",upload.single("vendorImage"),VendorController.vendorsignup)
apiRouter.post("/vendor/login",VendorController.vendorlogin)

//hotel
apiRouter.post("/hotel/create",verifyVendorToken,isVendor,upload.single("hotelImage"),HotelController.hotelcreate)  
apiRouter.get("/hotel",HotelController.list)
apiRouter.post("/hotel/update/:id",verifyVendorToken,isSameVendor,upload.single("hotelImage"),HotelController.hotelupdate)
apiRouter.post("/hotel/delete/:id",verifyVendorToken,isSameVendor,HotelController.hoteldelete)



module.exports=apiRouter