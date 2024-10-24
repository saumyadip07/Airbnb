const joi=require("joi")

const hotelSchemaValidation=joi.object({
    name:joi.string().required(),
    description:joi.string().required(),
    address:joi.string().required(),
    city:joi.string().required(),
    price:joi.number().required(),    
    vendorId:joi.string().required(),
    hotelImage:joi.string()
    
})

module.exports=hotelSchemaValidation