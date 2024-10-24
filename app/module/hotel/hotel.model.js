const mongoose=require("mongoose")

const hotelSchema=mongoose.Schema({
    name:{
        type:String,
    },

    description:{
        type:String
    },
    address:{
        type:String
    },
    city:{
        type:String
    },
    price:{
        type:Number
    },

    vendorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Vendor"
    },
  
    hotelImage:{
        type:String
    },
    bookings:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:null

        }
    ],

    

    isApprove:{
        type:Boolean,
        default:false
    },

   
},{
    timestamps:true,
    versionKey:false
})

module.exports=mongoose.model("Hotel",hotelSchema)