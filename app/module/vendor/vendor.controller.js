const Vendor=require("../vendor/vendor.model")
const Hotel=require("../hotel/hotel.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const vendorSchemaValidation=require("../vendor/vendor.validation")
const {loginVendor } = require("./vendor.controller.repo")
const { privateDecrypt } = require("crypto")
const fs=require("fs")
const path=require("path")


class VendorController{
    vendorloginForm=async(req,res)=>{
        try {
            res.render("vendor/vendorLoginForm.ejs")
        } catch (error) {
            console.log(error)
        }
    
    }

    vendorlogin=async(req,res)=>{
        try {
            const { email, password } = req.body;
            
            const token=await loginVendor(email,password)
    
            const options = {
                httpOnly: true,
                secure: true
            }
    
            if(token){
                res.cookie("VendorToken",token,options)
                res.redirect("/vendor/Dashboard")
            }
            // Respond with success message and token
         
          } catch (error) {
            // Error handling
            console.log(error.message);
            
          }
        }

        vendorDashboard=async(req,res)=>{
            try {
                const vendor=await Vendor.findById(req.userView._id)
                console.log("Vendor",vendor)
                res.render("vendor/dashboard.ejs",{title:"Vendor dashboard",vendor})
            } catch (error) {
                console.log(error)
            }
        }

        Allhotel=async(req,res)=>{
            try {
                const id=req.userView._id
                const vendor=await Vendor.findById(id)
                const hotels=await Hotel.aggregate([
                    {
                        $match:{
                            vendorId:id
                        }
                    },
                  
                ])
         
                res.render("vendor/allhotel.ejs",{hotels,vendor})
            } catch (error) {
                console.log(error)
            }
        }

        Allbooking = async (req, res) => {
            try {
                const id = req.userView._id; // Vendor ID from the session or token
                const vendor = await Vendor.findById(id); // Fetch the vendor's details
                
                // Fetch all hotels that belong to this vendor and populate booking details
                const bookings = await Hotel.aggregate([
                    {
                        $match: {
                            vendorId: id // Match hotels associated with the vendor
                        }
                    },
                    {
                        $lookup: {
                            from: "users", // Reference to the 'users' collection
                            localField: "bookings", // The 'bookings' array field in 'Hotel' that holds user IDs
                            foreignField: "_id", // The '_id' field in 'users' collection
                            as: "bookingDetails" // Output field for the user details
                        }
                    },
                    {
                        $unwind: "$bookingDetails" // Unwind in case bookings is an array
                    },
                    {
                        $project: {
                            hotelname: "$name", // Project the hotel name
                            hotelAddress: "$address", // Project the hotel address
                            hotelCity: "$city", // Project the hotel city
                            "bookingDetails.name": 1, // User's name from the booking details
                            "bookingDetails.email": 1, // User's email from the booking details
                            "bookingDetails.userImage": 1 // User's image from the booking details
                        }
                    }
                ]);
        
                // Render the EJS template and pass the bookings and vendor details
                res.render("vendor/allbookings.ejs", { bookings, vendor });
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        };

        addhotel=async(req,res)=>{
            try {
                const vendor=await Vendor.findById(req.userView._id)
                res.render("vendor/addhotel.ejs",{vendor})
            } catch (error) {
                console.log(error)
            }
        }

        hotelcreate = async (req, res) => {
            try {
              // Fetch vendor based on the logged-in user
              const vendor = await Vendor.findById(req.userView._id);
          
              // Ensure that the form data is coming through properly
              if (!req.body.name || !req.body.address || !req.body.city) {
                console.log("All fields are required") 
              }
          
              // Create a new hotel object using form data
              const hotel = await Hotel.create({
                name: req.body.name,
                address: req.body.address,
                description: req.body.description,
                city: req.body.city,
                price: req.body.price,
                vendorId: vendor._id
              });
          
              // Check if there is a file uploaded (image)
              if (req.file) {
                let imgUrl = `${req.protocol}://${req.get("host")}/upload/`;
                hotel.hotelImage = `${imgUrl}${req.file.filename}`;
              }
          
              // Save the hotel document
              await hotel.save();
          
              // Redirect the vendor to their hotel listings page
              res.redirect("/vendor/hotel");
            } catch (error) {
              // Handle any errors during the process
              console.log(error);
              res.status(500).json({ message: error.message || "Internal Server Error" });
            }
          };

          hotelEditForm=async(req,res)=>{
            try {
                const vendor=await Vendor.findById(req.userView._id)
                const hotel=await Hotel.findById(req.params.id)
                res.render("vendor/hotelEditForm.ejs",{hotel,vendor})
            } catch (error) {
                console.log(error)
            }
        }

        hotelupdate=async(req,res)=>{
            try {
            const vendor=await Vendor.findById(req.userView._id)
            const hotel=await Hotel.findById(req.params.id)
            hotel.name=req.body.name
            hotel.address=req.body.address
            hotel.description=req.body.description
            hotel.city=req.body.city
            hotel.price=req.body.price
            hotel.isApprove=false    


                   
            let imageUrl=hotel.hotelImage
            imageUrl=imageUrl.split("/")
 
            let filename=imageUrl[imageUrl.length-1]
            let filepath=path.join(__dirname,`../../../upload/${filename}`)



                if(req.file){
                    fs.unlinkSync(filepath)
                    let imgUrl=`${req.protocol}://${req.get("host")}/upload/`
                    hotel.hotelImage=`${imgUrl}${req.file.filename}`
                }
                await hotel.save()
                res.redirect("/vendor/hotel")
            } catch (error) {
                console.log(error)
            }
        }

        deletehotel=async(req,res)=>{
            try {
                const vendor=await Vendor.findById(req.userView._id)
                const hotel=await Hotel.findById(req.params.id)

                let imageUrl=hotel.hotelImage
                imageUrl=imageUrl.split("/")

                let filename=imageUrl[imageUrl.length-1]
                let filepath=path.join(__dirname,`../../../upload/${filename}`)
                fs.unlinkSync(filepath)

                await Hotel.findByIdAndDelete(req.params.id)
                res.redirect("/vendor/hotel")
            } catch (error) {
                console.log(error)
            }
        }
          
        

        vendorLogout=async(req,res)=>{
            try {
                res.clearCookie("VendorToken")
                res.redirect("/vendor")
            } catch (error) {
                console.log(error)
            }
        }
}


module.exports=new VendorController()