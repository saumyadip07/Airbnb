const Admin=require("../admin/admin.model")
const Hotel=require("../hotel/hotel.model")
const Vendor=require("../vendor/vendor.model")
const Contact=require("../www/contact.model")
const User=require("../user/user.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const { loginAdmin } = require("./admin.controller.repo")


class AdminDashboardController{

    adminloginForm=async(req,res)=>{
        try {
            res.render("admin/adminLoginForm.ejs")
        } catch (error) {
           console.log(error)
        }
    }

   Adminlogin=async(req,res)=>{
    try {
        const { email, password } = req.body;
        
        const token=await loginAdmin(email,password)

        const options = {
            httpOnly: true,
            secure: true
        }

        if(token){
            res.cookie("AdminToken",token,options)
            res.redirect("/admin/Dashboard")
        }
        // Respond with success message and token
     
      } catch (error) {
        // Error handling
        console.log(error.message);
        
      }
    }

    adminDashboard=async(req,res)=>{
        try {
            const admin=await Admin.findById(req.userView._id)
            console.log("Admin",admin)
            res.render("admin/dashboard.ejs",{title:"Admin dashboard",admin})
        } catch (error) {
            console.log(error)
        }
    }

    Allhotel=async(req,res)=>{
        try {
            const admin=await Admin.findById(req.userView._id)
            const hotels=await Hotel.aggregate([
                {
                    $lookup:{
                        from:"vendors",
                        localField:"vendorId",
                        foreignField:"_id",
                        as:"vendor"
                    },
                },
                {   
                    $unwind:"$vendor"   

                },
                {
                    $project:{
                        name:1,
                        description:1,
                        address:1,
                        city:1,
                        price:1,
                        hotelImage:1,
                        isApprove:1,
                        "vendor.name":1
                    }
                }
            ])
            res.render("admin/allhotel.ejs",{hotels,admin})
        } catch (error) {
            console.log(error)
        }
    }

    hotelApprove=async(req,res)=>{
        try {
            const hotel=await Hotel.findById(req.params.id)
            hotel.isApprove=true
            await hotel.save()
            res.redirect("/admin/hotel")
        } catch (error) {
            console.log(error)
        }
    }

    Allvendor=async(req,res)=>{
        try {
            const admin=await Admin.findById(req.userView._id)
            const vendors=await Vendor.find()
            res.render("admin/allvendor.ejs",{vendors,admin})
        } catch (error) {
            console.log(error)
        }
    }

    Alluser=async(req,res)=>{
        try {
            const admin=await Admin.findById(req.userView._id)
            const users=await User.find()
            res.render("admin/alluser.ejs",{users,admin})
        } catch (error) {
            console.log(error)
        }
    }
    Allbooking=async(req,res)=>{
        try {
            const admin=await Admin.findById(req.userView._id)
            const bookings=await Hotel.aggregate([
                {
                    $lookup: {
                      from: "users", // Reference to the users collection
                      localField: "bookings", // This should match the bookings field, which holds user IDs
                      foreignField: "_id", // The _id field in users collection
                      as: "bookingDetails" // Output field for the user details
                    }
                  },
                  {
                    $unwind: "$bookingDetails" // Unwind the booking details if bookings are arrays
                  },
                  {
                    $lookup: {
                      from: "vendors", // Reference to the vendors collection
                      localField: "vendorId", // This should match the vendorId field, which holds the vendor ID
                      foreignField: "_id", // The _id field in vendors collection
                      as: "vendorDetails" // Output field for the hotel name
                    }
                  },
                  {
                    $unwind: "$vendorDetails" // Unwind the vendor details if vendorId is an array
                  },
                  {
                    $project: {
                      hotelname: "$name",// Hotel name from the Hotel collection
                      hotelAddress: "$address", // Hotel address from the Hotel collection
                      hotelCity: "$city", // Hotel city from the Hotel collection
                      hotelPrice: "$price", // Hotel price from the Hotel collection

                      "vendorDetails.name": 1,
                      "bookingDetails.name": 1, // User's name from the joined user details
                      "bookingDetails.email": 1, // User's email from the joined user details
                      "bookingDetails.userImage": 1 // User's image from the joined user details
                    }
                  }
            ])
            res.render("admin/allbookings.ejs",{bookings,admin})
    }catch (error) {
        console.log(error)
    }
   }

    adminLogout=async(req,res)=>{
        try {
            res.clearCookie("AdminToken")
            res.redirect("/admin")
        } catch (error) {
            console.log(error)
        }
    }

    Allcontact=async(req,res)=>{
        try {
            const admin=await Admin.findById(req.userView._id)
            const contacts=await Contact.find()
            res.render("admin/allcontact.ejs",{contacts,admin})
        } catch (error) {
            console.log(error)
        }
    }



}


module.exports=new AdminDashboardController()