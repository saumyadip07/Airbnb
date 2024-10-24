const Vendor = require("../vendor/vendor.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const vendorSchemaValidation = require("../vendor/vendor.validation");
const { createVendor, loginVendor } = require("../vendor/vendor.controller.repo");
const  transporter  = require("../../helper/mailer");

class VendorController {

  vendorsignup = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log(req.body);
      
      // Validate user data
      const {error,value:data} =  vendorSchemaValidation.validate(req.body);
      
      if(error) return res.status(400).json({message:error.details[0].message})



      // Check if the user already exists
      const vendorExist = await Vendor.findOne({ email });
      if (vendorExist) {
        return res.status(400).json({ message: "Vendor already exists" });
      }
      

      // Create the user with hashed password and optional file (if uploaded)
      const createdVendor = await createVendor(data);

      let imgUrl=`${req.protocol}://${req.get("host")}/upload/`
    
      if(req.file){
        createdVendor.vendorImage=`${imgUrl}${req.file.filename}`
  
          
      }

      await createdVendor.save();

      
      const info = await transporter.sendMail({
        from: "manutd.saumya7@gmail.com", // sender address
        to: createdVendor.email, // list of receivers
        subject: "Email verification", // Subject line

        html: `Hello ${createdVendor.name} , thank you for signup. \n\n \n Your email id is ${createdVendor.email} \n \n\n Your password is ${req.body.password}`,
      }); 

      // Respond with success message and created user data
      res.status(201).json({
        message: "vendor created successfully",
        vendor: createdVendor,
        
      });

    } catch (error) {
      // Error handling
      res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  };

  vendorlogin = async (req, res) => {
    try {
      const { email, password } = req.body;
    
      const token=await loginVendor(email,password)
      
      // Respond with success message and token
      
      
      res.status(200).json({ message: "Login successful",token});
    } catch (error) {
      // Error handling
      
      res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  };
     

}

module.exports = new VendorController();
