const User = require("../user/user.model");
const Token=require("../user/token.model")

const Hotel=require("../hotel/hotel.model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto=require("crypto")
const userSchemaValidation = require("../user/user.validation");
const { createUser, loginUser, getToken } = require("../user/user.controller.repo");
const  transporter  = require("../../helper/mailer");

class UserController {

  usersignup = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log(req.body);
      
      // Validate user data
      const {error,value:data} =  userSchemaValidation.validate(req.body);
      console.log(data)
      if(error) return res.status(400).json({message:error.details[0].message})



      // Check if the user already exists
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(400).json({ message: "User already exists" });
      }

      
      

      // Create the user with hashed password and optional file (if uploaded)
      const createdUser = await createUser(data);

      let imgUrl=`${req.protocol}://${req.get("host")}/upload/`
    
      if(req.file){
        createdUser.userImage=`${imgUrl}${req.file.filename}`
  
          
      }

      const newUser=await createdUser.save();

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

        html: `Hello ${newUser.name} , thank you for signup. \n\n please click on the below link to verify your account \n\n http://${req.headers.host}/api/auth/confirmation/${newUser.email}/${token.token}`, // html body,
      }); 

      // Respond with success message and created user data
      res.status(201).json({
        message: "User created successfully, please verify your email id",
        user: newUser,
        
      });

    } catch (error) {
      // Error handling
      res.status(500).json({ message: error.message || "Internal Server Error" });
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
        return res.status(200).json({ message: "User verified successfully" });
        
      }
    } catch (error) {
      console.log(error.message);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  userlogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const token=await loginUser(email,password)
      
      // Respond with success message and token
      res.status(200).json({ message: "Login successful",token});
    } catch (error) {
      // Error handling
      console.log(error)
      res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  };

  bookingcreate=async(req,res)=>{
    try {
      const {id}=req.params
      const userId=req.user.userId
      const user=await User.findById(userId)
      console.log("user",user)
      const hotel=await Hotel.findById(id)

      console.log("hotel",hotel)
      if(!hotel){
        return res.status(400).json({message:"hotel not found"})
      }
    
      if (!hotel.bookings) {
        hotel.bookings = [];
      }
  
      // Push user to the hotel's bookings
      hotel.bookings.push(user._id);
    
      await hotel.save()
      res.status(201).json(hotel)  
    } catch (error) {
      res.status(500).json({message:error.message})
    }
  }

}

module.exports = new UserController();
