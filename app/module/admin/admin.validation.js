const joi =require("joi")

const adminSchemaValidation=joi.object({
    name:joi.string().required(),
    email:joi.string().email().required(),
    password:joi.string().required()
})

module.exports=adminSchemaValidation