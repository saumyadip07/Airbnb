const express=require("express")
const wwwController=require("../../module/www/www.controller")
const {verifyUserToken}=require("../../middleware/auth")
const upload=require("../../helper/multer")

const router=express.Router()

router.get("/",wwwController.home)
router.get("/services",wwwController.services)
router.get("/hotel",wwwController.hotel)
router.get("/blog",wwwController.blog)
router.get("/contact",wwwController.contact)


//user
router.get("/user/login/form",wwwController.userLoginForm)
router.post("/user/login",wwwController.userlogin)
router.get("/user/signup/form",wwwController.userSignupForm)
router.post("/user/signup",upload.single("userImage"),wwwController.usersignup)
router.get("/auth/confirmation/:email/:token", wwwController.confirmation);
// router.get("/user/profile",verifyUserToken,wwwController.userProfile)
router.get("/user/logout",wwwController.userLogout)
router.get("/user/dashboard",verifyUserToken,wwwController.userDashboard)


//vendor
router.get("/www/vendor/signup/form",wwwController.vendorSignupForm)
router.post("/www/vendor/signup",upload.single("vendorImage"),wwwController.vendorSignup)

//booking
router.get("/hotel/booking/details/:id",verifyUserToken,wwwController.hotelBookingDetails)
router.post("/booking/create/:id",verifyUserToken,wwwController.bookingCreate)

//contact

router.post("/contact/send",wwwController.contactSend)

//blog
router.get("/www/blog1",wwwController.blog1)
router.get("/www/blog2",wwwController.blog2)
router.get("/www/blog3",wwwController.blog3)
router.get("/www/blog4",wwwController.blog4)
router.get("/www/blog5",wwwController.blog5)
router.get("/www/blog6",wwwController.blog6)


module.exports=router