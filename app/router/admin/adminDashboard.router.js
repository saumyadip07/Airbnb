const express=require("express")
const {verifyAdminToken}=require("../../middleware/auth")
const adminDashboardController=require("../../module/admin/admin.controller")


const adminDashboardRouter=express.Router()


adminDashboardRouter.get("/",adminDashboardController.adminloginForm)
adminDashboardRouter.post("/login",adminDashboardController.Adminlogin)
adminDashboardRouter.get("/Dashboard",verifyAdminToken,adminDashboardController.adminDashboard)
adminDashboardRouter.get("/hotel",verifyAdminToken,adminDashboardController.Allhotel)
adminDashboardRouter.get("/logout",verifyAdminToken,adminDashboardController.adminLogout)    
adminDashboardRouter.get("/hotel/approve/:id",verifyAdminToken,adminDashboardController.hotelApprove)
adminDashboardRouter.get("/vendor",verifyAdminToken,adminDashboardController.Allvendor)
adminDashboardRouter.get("/user",verifyAdminToken,adminDashboardController.Alluser)
adminDashboardRouter.get("/booking",verifyAdminToken,adminDashboardController.Allbooking)
adminDashboardRouter.get("/contact",verifyAdminToken,adminDashboardController.Allcontact)

module.exports=adminDashboardRouter

