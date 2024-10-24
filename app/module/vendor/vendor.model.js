const mongoose=require("mongoose")

const vendorSchema=mongoose.Schema({
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
        default:"vendor"
    },
    vendorImage:{
        type:String
    },
   
},{
    timestamps:true,
    versionKey:false
})

module.exports=mongoose.model("Vendor",vendorSchema)