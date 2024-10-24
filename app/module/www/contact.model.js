const mongoose=require("mongoose")

const contactSchema=mongoose.Schema({

    name:{
        type:String,

    },
    email:{
        type:String
    },
    message:{
        type:String
    },


},{
    timestamps:true,
    versionKey:false
})

module.exports=mongoose.model("Contact",contactSchema)