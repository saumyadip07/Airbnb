const Hotel=require("../../module/hotel/hotel.model")
const mongoose=require("mongoose")  

const createHotel=async(validatedHotel)=>{
    // console.log("validatedHotel",validatedHotel)
    const {name,description,address,city,price,vendorId}=validatedHotel.value
    console.log("name",name)
    const hotel=new Hotel({
        name:name,
        description:description,
        address:address,
        city:city,
        price:price,
        vendorId:vendorId
    })
 
    const savedHotel=await hotel.save()
    console.log("savedhotel",savedHotel)
    return savedHotel
}

const updateHotel=async(validatedHotel,id)=>{
    
    const updatedHotel=await Hotel.findByIdAndUpdate(id,validatedHotel,{new:true})
    return updatedHotel
}

module.exports={createHotel,updateHotel}