const User=require("../../module/user/user.model")
const Token=require("../../module/user/token.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const createUser=async(validatedUser)=>{
    const {name,email,password}=validatedUser
    const hashedPassword=await bcrypt.hash(password,10)
    const user=new User({
        name:name,
        email:email,
        password:hashedPassword
    })
 
    const savedUser=await user.save()
    return savedUser
}

const getToken=async(token,role)=>{



  const receivedtoken=await Token.findOne({token,role})

  return receivedtoken
}

const loginUser=async(email,password)=>{

    const user = await User.findOne({ email } );
      if (!user) {
        console.log ("Invalid email or password" );
      }
      const isMatch = await bcrypt.compare(password, user.password);
   
      if (!isMatch) {
      console.log("Invalid email or password");
      }
      const token = jwt.sign({ userId: user._id ,email:user.email,role:user.role}, process.env.JWT_USER_SECRET, {
        expiresIn: "1d",
      });
      return token

}

module.exports={createUser,loginUser,getToken}