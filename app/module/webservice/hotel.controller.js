const Hotel=require("../../module/hotel/hotel.model")
const mongoose=require("mongoose")
const hotelSchemaValidation = require("../hotel/hotel.validation")
const { createHotel, updateHotel } = require("../hotel/hotel.controller.repo")
const fs=require("fs")
const path=require("path")

class HotelController{

    hotelcreate=async(req,res)=>{
        try {
            const {name,description,address,city,price,vendorId}=req.body

            const validatedHotel=await hotelSchemaValidation.validate(req.body)
            const newHotel= await createHotel(validatedHotel)
    
            console.log("New Hotel",newHotel)
            let imgUrl=`${req.protocol}://${req.get("host")}/upload/`
            if(req.file){
    
               newHotel.hotelImage=`${imgUrl}${req.file.filename}`
    
            //    newHotel.save()
            }
            const savedHotel=await newHotel.save()
            res.status(201).json(savedHotel)
        } catch (error) {
            res.status(400).json({message:error.message})
        }
       
    }

    list=async(req,res)=>{
        try {
            const hotels=await Hotel.find()
            res.status(200).json(hotels)
        } catch (error) {
            return res.status(400).json({message:error.message})
        }
       
    }

    hotelupdate=async(req,res)=>{
        try {
            const {id}=req.params

            const hotel=await Hotel.findById(id)    
            const {name,description,address,city,price,vendorId}=req.body
    
            const validatedHotel=await hotelSchemaValidation.validate(req.body)

            const updatedHotel=await updateHotel(validatedHotel,id)
            
            let imageUrl=hotel.hotelImage
            imageUrl=imageUrl.split("/")
 
            let filename=imageUrl[imageUrl.length-1]
            let filepath=path.join(__dirname,`../../../upload/${filename}`)
            

            if(req.file){

                fs.unlinkSync(filepath)
                let imgUrl=`${req.protocol}://${req.get("host")}/upload/`

                updatedHotel.hotelImage=`${imgUrl}${req.file.filename}`

                await updatedHotel.save()
            }

            
    
            // const updatedHotel=await Hotel.findByIdAndUpdate(id,validatedHotel,{new:true})
    
            res.status(200).json(updatedHotel)
        } catch (error) {
            return res.status(400).json({message:error.message})
        }
       

    }

    hoteldelete=async(req,res)=>{
        try {
            const {id}=req.params
            
            const hotel=await Hotel.findById(id)
            let imageUrl=hotel.hotelImage
            imageUrl=imageUrl.split("/")
 
            let filename=imageUrl[imageUrl.length-1]
            let filepath=path.join(__dirname,`../../../upload/${filename}`)
            fs.unlinkSync(filepath)

            const deletedHotel=await Hotel.findByIdAndDelete(id)
            res.status(200).json(deletedHotel)
        } catch (error) {
            return res.status(400).json({message:error.message})
        }

    }
}

module.exports=new HotelController()