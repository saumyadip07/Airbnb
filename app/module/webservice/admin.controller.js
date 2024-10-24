const Admin = require("../admin/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminSchemaValidation = require("../admin/admin.validation");

const  transporter  = require("../../helper/mailer");
const { createAdmin ,loginAdmin} = require("../admin/admin.controller.repo");

class AdminController {

  adminsignup = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log(req.body);
      
      // Validate user data
      const {error,value:data} =  adminSchemaValidation.validate(req.body);
      console.log(data)
      if(error) return res.status(400).json({message:error.details[0].message})



      // Check if the user already exists
      const adminExist = await Admin.findOne({ email });
      if (adminExist) {
        return res.status(400).json({ message: "Admin already exists" });
      }

      
      

      // Create the user with hashed password and optional file (if uploaded)
      const createdAdmin = await createAdmin(data);

      let imgUrl=`${req.protocol}://${req.get("host")}/upload/`
    
      if(req.file){
        createdAdmin.adminImage=`${imgUrl}${req.file.filename}`
  
          
      }

      await createdAdmin.save();

      
      const info = await transporter.sendMail({
        from: "manutd.saumya7@gmail.com", // sender address
        to: createdAdmin.email, // list of receivers
        subject: "Email verification", // Subject line

        html: `Hello ${createdAdmin.name} , thank you for signup. \n\n \n Your email id is ${createdAdmin.email} \n \n\n Your password is ${req.body.password}`,
      }); 

      // Respond with success message and created user data
      res.status(201).json({
        message: "Admin created successfully",
        admin: createdAdmin,
        
      });

    } catch (error) {
      // Error handling
      res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  };

  adminlogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const token=await loginAdmin(email,password)
      
      // Respond with success message and token
      res.status(200).json({ message: "Login successful",token});
    } catch (error) {
      // Error handling
      res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  };
     

}

module.exports = new AdminController();
