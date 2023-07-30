const express=require("express")
const {GalleryModel}=require("../Model/Gallery")
const GalleryRoute=express.Router()
GalleryRoute.get("/",async(req,res)=>{
    try{
      const data=await GalleryModel.find()
      res.send(data)
    }
    catch{
        res.send("Error")
    }
})
GalleryRoute.post("/",async(req,res)=>{
    const payload=req.body
   
    try{
       const data=new GalleryModel({...payload})
       await data.save()
       res.send(data)
       
    }
    catch(err){
        console.log(err)
        res.send("Post ERRoR")
    }
})



GalleryRoute.patch("/:id",async(req,res)=>{
    const id=req.params.id 
    const payload=req.body
    try{
    await GalleryModel.findByIdAndUpdate({"_id":id},payload)
    res.send("Update Success")
    }
    catch{
     res.send("Update Error")
    }
})

GalleryRoute.delete("/:id",async(req,res)=>{
    const id=req.params.id 
    try{
    await GalleryModel.findByIdAndDelete({"_id":id})
    res.send("Update Success")
    }
    catch{
     res.send("Update Error")
    }
})

module.exports={
    GalleryRoute
}