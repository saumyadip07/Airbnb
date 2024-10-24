const Admin=require("../admin/admin.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const createAdmin=async(validatedAdmin)=>{
    const {name,email,password}=validatedAdmin
    const hashedPassword=await bcrypt.hash(password,10)
    const admin=new Admin({
        name:name,
        email:email,
        password:hashedPassword
    })
 
    const savedAdmin=await admin.save()
    return savedAdmin
}

const loginAdmin=async(email,password)=>{
    const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const token = jwt.sign({ adminId: admin._id ,email:admin.email,role:admin.role}, process.env.JWT_ADMIN_SECRET, {
        expiresIn: "1d",
      });
      return token

}

module.exports={createAdmin,loginAdmin}