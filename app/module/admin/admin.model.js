const mongoose=require("mongoose")

const adminSchema=mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    role:{
        type:String,
        default:"admin"
    },
    adminImage:{
        type:String
    },
   
},{
    timestamps:true,
    versionKey:false
})

module.exports=mongoose.model("Admin",adminSchema)