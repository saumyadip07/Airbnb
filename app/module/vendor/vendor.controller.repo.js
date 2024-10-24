const Vendor=require("../vendor/vendor.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const createVendor=async(validatedVendor)=>{
    const {name,email,password}=validatedVendor
    const hashedPassword=await bcrypt.hash(password,10)
    const vendor=new Vendor({
        name:name,
        email:email,
        password:hashedPassword
    })
 
    const savedVendor=await vendor.save()
    return savedVendor
}

const loginVendor=async(email,password)=>{
    const vendor = await Vendor.findOne({ email });
      if (!vendor) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const isMatch = await bcrypt.compare(password, vendor.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const token = jwt.sign({ vendorId: vendor._id ,email:vendor.email,role:vendor.role}, process.env.JWT_VENDOR_SECRET, {
        expiresIn: "1d",
      });
      return token

}

module.exports={createVendor,loginVendor}