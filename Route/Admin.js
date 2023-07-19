const express=require("express")
const {AdminModel}=require("../Model/Admin")
const AdminRoute=express.Router()
AdminRoute.get("/",async(req,res)=>{
    try{
      const data=await AdminModel.find()
      res.send(data)
    }
    catch{
        res.send("Error")
    }
})
AdminRoute.post("/login",async(req,res)=>{
    const payload=req.body
    try{
        const AdminDetails=await AdminModel.find({email:payload.email,password:payload.password})
        console.log(AdminDetails)
         if(AdminDetails.length>0){
            res.send(AdminDetails[0]._id)
         }else{
            res.send("WRONG DETAILS")
         }
       
    }
    catch{
        res.send("Post ERRoR")
    }
})



AdminRoute.patch("/:id",async(req,res)=>{
    const id=req.params.id 
    const payload=req.body
    try{
    await AdminModel.findByIdAndUpdate({"_id":id},payload)
    res.send("Update Success")
    }
    catch{
     res.send("Update Error")
    }
})

module.exports={
    AdminRoute
}