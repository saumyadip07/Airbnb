const Hotel=require("../hotel/hotel.model")
const Vendor=require("../vendor/vendor.model")
const Token=require("../user/token.model")
const Contact=require("../www/contact.model")
const User=require("../user/user.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const userSchemaValidation = require("../user/user.validation")
const { createUser, getToken } = require("../user/user.controller.repo")
const crypto=require("crypto")
const transporter=require("../../helper/mailer")
const mongoose=require("mongoose")

class wwwController{

    home=async(req,res)=>{
        try {
            const authenticated = req.cookies.UserToken ? true : false
            console.log(authenticated)
            let userName=null
            let userImage=null
            if(authenticated){
            const decoded= jwt.verify(req.cookies.UserToken ,process.env.JWT_USER_SECRET)
            // console.log("decoded",decoded)
          

            let user=await User.findById(decoded.userId)
            userName=user.name
            userImage=user.userImage
            }

            let hotels=await Hotel.find()
            // console.log(userName,userImage)
            res.render("www/index.ejs",{authenticated,userName,userImage,hotels})
        } catch (error) {
            console.log(error)
        }
     
    }
    services=async(req,res)=>{

        const authenticated = req.cookies.UserToken ? true : false
            console.log(authenticated)
            let userName=null
            let userImage=null
            if(authenticated){
            const decoded= jwt.verify(req.cookies.UserToken ,process.env.JWT_USER_SECRET)
            // console.log("decoded",decoded)
            let user=await User.findById(decoded.userId)
            userName=user.name
            userImage=user.userImage
            }
        res.render("www/services.ejs",{authenticated,userName,userImage})
    }
    hotel=async(req,res)=>{
        const authenticated = req.cookies.UserToken ? true : false
        console.log(authenticated)
        let userName=null
        let userImage=null
        if(authenticated){
        const decoded= jwt.verify(req.cookies.UserToken ,process.env.JWT_USER_SECRET)
        // console.log("decoded",decoded)
        let user=await User.findById(decoded.userId)
        userName=user.name
        userImage=user.userImage
        }
        let hotels=await Hotel.find()
        let cities = await Hotel.distinct('city');
        res.render("www/hotel.ejs",{authenticated,userName,userImage,hotels,cities})
    }

    blog=async(req,res)=>{
        const authenticated = req.cookies.UserToken ? true : false
        console.log(authenticated)
        let userName=null
        let userImage=null
        if(authenticated){
        const decoded= jwt.verify(req.cookies.UserToken ,process.env.JWT_USER_SECRET)
        // console.log("decoded",decoded)
        let user=await User.findById(decoded.userId)
        userName=user.name
        userImage=user.userImage
        }
        res.render("www/blog.ejs",{authenticated,userName,userImage})
    }
    contact=async(req,res)=>{
        const authenticated = req.cookies.UserToken ? true : false
        console.log(authenticated)
        let userName=null
        let userImage=null
        if(authenticated){
        const decoded= jwt.verify(req.cookies.UserToken ,process.env.JWT_USER_SECRET)
        // console.log("decoded",decoded)
        let user=await User.findById(decoded.userId)
        userName=user.name
        userImage=user.userImage
        }
        res.render("www/contact.ejs",{authenticated,userName,userImage})
    }


    userSignupForm=async(req,res)=>{
        try {
            res.render("www/userSignupForm.ejs")
        }catch (error) {
            console.log(error)
      }
    }

    usersignup = async (req, res) => {
        try {
          const { name, email, password } = req.body;
          console.log(req.body);
          
          // Validate user data
        //   const {error,value:data} =  userSchemaValidation.validate(req.body);
        //   console.log(data)
        //   if(error) {
        //     req.flash("error",error.details[0].message)
        //     res.redirect("/user/signup/form")
            
        //   }
    
    
          // Check if the user already exists
          const userExist = await User.findOne({ email });
          if (userExist) {
            req.flash("error","User already exists")
            res.redirect("/user/signup/form")
          }
    
          
          
    
          // Create the user with hashed password and optional file (if uploaded)
          const hashedPassword=await bcrypt.hash(password,10)
          const user=new User({
              name:name,
              email:email,
              password:hashedPassword
    })
    
          let imgUrl=`${req.protocol}://${req.get("host")}/upload/`
        
          if(req.file){
            user.userImage=`${imgUrl}${req.file.filename}`
      
              
          }
    
          const newUser=await user.save();
    
          const token = new Token({
            userId: newUser._id,
            role:"user",
            token: crypto.randomBytes(16).toString("hex"),
          });
    
          const newToken=await token.save();
    
          
          const info = await transporter.sendMail({
            from: "manutd.saumya7@gmail.com", // sender address
            to: newUser.email, // list of receivers
            subject: "Email verification", // Subject line
    
            html: `Hello ${newUser.name} , thank you for signup. \n\n please click on the below link to verify your account \n\n http://${req.headers.host}/auth/confirmation/${newUser.email}/${token.token}`, // html body,
          }); 
    
          // Respond with success message and created user data
          req.flash("success","User created successfully,please verify your email")
          res.redirect("/user/login/form")

    
        } catch (error) {
          // Error handling
          console.log(error)
        }
      };

      confirmation = async (req, res) => {
        try {
          const { token } = req.params;
          const tokenRecord = await getToken(token,"user");
          if (!token) {
            return res.status(400).json({ message: "token has been expired"});
          }
    
          // const user=await User.findOne({_id:token.userId,email:req.params.email})
          const user = await User.findOne({
            _id: tokenRecord.userId,
            email: req.params.email,
          });
    
          console.log(user);
    
          if (!user) {
            console.log("user is not found")
            return res.status(400).json({ message: "user is not found" });
    
    
          } else if (user.isVerified) {
            console.log("user is already verified");
    
            return res.status(400).json({ message: "user is already verified" });
          } else {
             user.isVerified = true,
             await user.save();
            console.log("User verified successfully");
    
          
        
            await Token.findByIdAndDelete(tokenRecord._id)
            return res.redirect("/user/login/form")
            
          }
        } catch (error) {
          console.log(error.message);
    
          res.status(500).json({
            success: false,
            message: error.message,
          });
        }
      };


    userLoginForm=async(req,res)=>{
        try {
            res.render("www/userLoginForm.ejs")
        }catch (error) {
            console.log(error)
      }
    }

    userlogin=async(req,res)=>{
        try {
            const {email,password}=req.body
            const user=await User.findOne({email})
            if(!user){
                req.flash("error","User not found enter valid email and password")
                return res.redirect("/user/login/form")
            }
            const isMatch=await bcrypt.compare(password,user.password)
            if(!isMatch){
                req.flash("error","User not found enter valid email and password")
                return res.redirect("/user/login/form")
            }
            const token=jwt.sign({userId:user._id,email:user.email,role:user.role},process.env.JWT_USER_SECRET,{
                expiresIn:"1d"
            })
            res.cookie("UserToken",token)
            req.flash("success","Login successfully")
            return res.redirect("/")
        } catch (error) {
            console.log(error)
        }
    }
    userDashboard=async(req,res)=>{
        try {
            const userId=req.userView._id
            const user=await User.findById(userId)
            const bookings = await Hotel.aggregate([
                {
                    $match: {
                        bookings: userId // Match hotels where the user's ID is in the bookings array
                    }
                },
                {
                    $lookup: {
                        from: "users", // Join with users to get booking details
                        localField: "bookings", // Field in the hotel collection
                        foreignField: "_id", // Field in the user collection
                        as: "userDetails" // Output array containing user details
                    }
                },
                {
                    $lookup:{
                        from:"vendors",
                        localField:"vendorId",
                        foreignField:"_id",
                        as:"vendorDetails"
                    }
                },
                {
                    $project: {
                        name: 1,
                        description: 1,
                        address: 1,
                        city: 1,
                        price: 1,
                        hotelImage: 1,
                        vendorEmail: { $arrayElemAt: ["$vendorDetails.email", 0] }, 
                        userDetails: {
                            $filter: {
                                input: "$userDetails",
                                as: "user",
                                cond: { $eq: ["$$user._id", userId] } // Filter to include only the current user
                            }
                        }
                    }
                }
            ]);

          const authenticated = req.cookies.UserToken ? true : false
          console.log(authenticated)
          let userName=null
          let userImage=null
          if(authenticated){
          const decoded= jwt.verify(req.cookies.UserToken ,process.env.JWT_USER_SECRET)
        // console.log("decoded",decoded)
          let user=await User.findById(decoded.userId)
          userName=user.name
          userImage=user.userImage
    
           res.render("www/userDashboard.ejs",{bookings,user,authenticated,userName,userImage})
        }
     }     catch (error) {
            console.log(error)
        }
    }

    userLogout=async(req,res)=>{
        res.clearCookie("UserToken")
        req.flash("success","Logout successfully")
        return res.redirect("/")
    }


    //vendor
    vendorSignupForm=async(req,res)=>{
        try {
            res.render("www/vendorSignupForm.ejs")
        }catch (error) {
            console.log(error)
      }
    }

    vendorSignup=async(req,res)=>{
        try {
            const {name,email,password}=req.body
            const vendor=await Vendor.findOne({email})
            if(vendor){
                req.flash("error","Vendor already exist")
                return res.redirect("/www/vendor/signup/form")
            }
            const hashedPassword=await bcrypt.hash(password,10)
            const newVendor=new Vendor({
                name:name,
                email:email,
                password:hashedPassword
            })
        

            let imgUrl=`${req.protocol}://${req.get("host")}/upload/`
            if(req.file){
                newVendor.vendorImage=`${imgUrl}${req.file.filename}`
            }

           const savedVendor= await newVendor.save();

            const info = await transporter.sendMail({
                from: "manutd.saumya7@gmail.com", // sender address
                to: savedVendor.email, // list of receivers
                subject: "Email verification", // Subject line
        
                html: `Hello ${savedVendor.name} , thank you for signup as a vendor. \n\n Your email id is ${savedVendor.email} \n\n Your password is ${req.body.password}. Now Login and do your Business `, // html body,
              }); 


            req.flash("success","Vendor created successfully,please go through your email and login")
            return res.redirect("/vendor")


        } catch (error) {
            console.log(error)
        }
    }


    hotelBookingDetails=async(req,res)=>{
        try {
            const userId=req.userView._id
     
            const user=await User.findById({_id:userId})
            const hotel=await Hotel.aggregate([
                {
                    // Match the hotel with the provided ID
                    $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
                },
                {
                    $lookup:{
                        from:"vendors",
                        localField:"vendorId",
                        foreignField:"_id",
                        as:"vendorDetails"
                    }
                },
                {
                    $unwind:"$vendorDetails"
                },
                {
                    $project:{
                        name:1,
                        description:1,
                        hotelImage:1,
                        price:1,
                        address:1,
                        city:1,

                        "vendorDetails.name":1,
                    }
                }
            ])
            res.render("www/hotelBookingDetails.ejs",{user,hotel:hotel[0]})
        }catch (error) {
            console.log(error)
      }
    }

    bookingCreate=async(req,res)=>{
        try {
            const {id}=req.params
            const userId=req.user.userId
            const user=await User.findById(userId)
            console.log("user",user)
            const hotel=await Hotel.findById(id)
      
            console.log("hotel",hotel)
            if(!hotel){
              console.log("hotel not found")
            }
          
            if (!hotel.bookings) {
              hotel.bookings = [];
            }
        
            // Push user to the hotel's bookings
            hotel.bookings.push(user._id);

            if(!user.bookings){
              user.bookings=[];
            }
            user.bookings.push(hotel._id)
          
            await hotel.save()
            await user.save()
            req.flash("success","Booking created successfully")
            res.redirect("/user/dashboard")
          } catch (error) {
            res.status(500).json({message:error.message})
          }
    }

    contactSend=async(req,res)=>{
        try {
            const {name,email,message}=req.body
            const contact=new Contact({
                name:name,
                email:email,
                message:message
            })

            await contact.save()
            req.flash("success","Contact send successfully, we will contact you soon")
            res.redirect("/contact")
        } catch (error) {
            console.log(error)
        }
    }

    blog1=async(req,res)=>{
        try {
            res.render("www/blog1.ejs")
        }catch (error) {
            console.log(error)
      }
    }

    blog2=async(req,res)=>{
        try {
            res.render("www/blog2.ejs")
        }catch (error) {
            console.log(error)
      }
    }

    blog3=async(req,res)=>{
        try {
            res.render("www/blog3.ejs")
        }catch (error) {
            console.log(error)
      }
    }

    blog4=async(req,res)=>{
        try {
            res.render("www/blog4.ejs")
        }catch (error) {
            console.log(error)
      }
    }

    blog5=async(req,res)=>{
        try {
            res.render("www/blog5.ejs")
        }catch (error) {
            console.log(error)
      }
    }

    blog6=async(req,res)=>{
        try {
            res.render("www/blog6.ejs")
        }catch (error) {
            console.log(error)
      }
    }


    
}

module.exports=new wwwController()