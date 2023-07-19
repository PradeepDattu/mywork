const express=require("express")
const {UsersModel}=require("../Model/User")
const UsersRoute=express.Router()
const {AppointmentModel}=require("../Model/Appoiment")
const {EventModel}=require("../Model/EventBooking")
const {HoroModel}=require("../Model/Horoscope")
UsersRoute.get("/", async (req, res) => {
    try {
      const { query } = req.query;
      let data;
  
      if (query) {
        data = await UsersModel.find({
          $or: [
            { fname: { $regex: query, $options: "i" } },
            { phone: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { lname: { $regex: query, $options: "i" } }
          ]
        }).exec();
      } else {
        data = await UsersModel.find();
      }
  
      res.send(data);
    } catch (error) {
      res.status(500).send("Error");
    }
  });
  
  

UsersRoute.get("/:id",async(req,res)=>{
    const id=req.params.id 
    try{
      const data=await UsersModel.find({_id:id})
      res.send(data)
    }
    catch{
        res.send("Error")
    }
})

UsersRoute.delete("/:id",async(req,res)=>{
    const id=req.params.id 
    try{
        await AppointmentModel.deleteMany({ userId: id });
        await HoroModel.deleteMany({userId:id})
        await EventModel.deleteMany({ userId: id });
        await UsersModel.findByIdAndDelete({"_id":id})
    res.send("Delete Success")
    }
    catch (err){
      console.log(err)
     res.send("Delete Error")
    }
})

UsersRoute.patch("/:id",async(req,res)=>{
    const id=req.params.id 
    const payload =req.body
    try{
    await UsersModel.findByIdAndUpdate({"_id":id},payload)
    res.send("Update Success")
    }
    catch{
     res.send("Update Error")
    }
})

UsersRoute.post("/",async(req,res)=>{
    
    const payload =req.body
    const data=await UsersModel.find({phone:payload.phone})
    try{
        if(data.length>0){
            await UsersModel.findByIdAndUpdate({"_id":data[0]._id},payload)
            res.send("Update Success")
        }
    else{
        const user= new UsersModel(payload)
        await user.save()
        res.send("Add Successful")
    }
    
    }
    catch{
     res.send("Update Error")
    }
})

module.exports={
    UsersRoute
}