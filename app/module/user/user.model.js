const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
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
        default:"user"
    },
    userImage:{
        type:String
    },
    bookings:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Hotel",
            default:null
        }
    ],
    isVerified:{
        type:Boolean,
        default:false
    },
   
},{
    timestamps:true,
    versionKey:false
})

module.exports=mongoose.model("User",userSchema)