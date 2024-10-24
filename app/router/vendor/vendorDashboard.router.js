const express=require("express")
const {verifyVendorToken}=require("../../middleware/auth")
const upload=require("../../helper/multer")
const vendorDashboardController=require("../../module/vendor/vendor.controller")


const vendorDashboardRouter=express.Router()

vendorDashboardRouter.get("/",vendorDashboardController.vendorloginForm)
vendorDashboardRouter.post("/login",vendorDashboardController.vendorlogin)
vendorDashboardRouter.get("/Dashboard",verifyVendorToken,vendorDashboardController.vendorDashboard)
vendorDashboardRouter.get("/logout",verifyVendorToken,vendorDashboardController.vendorLogout) 
vendorDashboardRouter.post("/hotel/create",verifyVendorToken,upload.single("hotelImage"),vendorDashboardController.hotelcreate)
vendorDashboardRouter.get("/hotel",verifyVendorToken,vendorDashboardController.Allhotel)
vendorDashboardRouter.get("/addhotel",verifyVendorToken,vendorDashboardController.addhotel)
vendorDashboardRouter.get("/edithotel/:id",verifyVendorToken,vendorDashboardController.hotelEditForm)
vendorDashboardRouter.post("/hotel/update/:id",verifyVendorToken,upload.single("hotelImage"),vendorDashboardController.hotelupdate)
vendorDashboardRouter.get("/deletehotel/:id",verifyVendorToken,vendorDashboardController.deletehotel)
vendorDashboardRouter.get("/booking",verifyVendorToken,vendorDashboardController.Allbooking)



module.exports=vendorDashboardRouter