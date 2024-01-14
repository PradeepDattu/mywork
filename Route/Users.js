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
});


UsersRoute.post("/:id/family", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UsersModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newFamilyMember = req.body; // Assuming you send the new family member data in the request body
    user.family.push(newFamilyMember);
    await user.save();

    res.status(201).json(newFamilyMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all family members for a specific user
UsersRoute.get("/:id/family", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UsersModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.family);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a family member for a specific user (partial update)
UsersRoute.patch("/:userId/family/:familyMemberId", async (req, res) => {
  const userId = req.params.userId;
  const familyMemberId = req.params.familyMemberId;

  try {
    const user = await UsersModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const familyMemberIndex = user.family.findIndex(
      (member) => member._id.toString() === familyMemberId
    );

    if (familyMemberIndex === -1) {
      return res.status(404).json({ message: "Family member not found" });
    }

    // Partial update: only update the fields provided in the request body
    const updatedFields = req.body; // Assuming you send the updated fields in the request body

    // Loop through the updated fields and update the corresponding family member fields
    for (const key in updatedFields) {
      if (Object.hasOwnProperty.call(updatedFields, key)) {
        user.family[familyMemberIndex][key] = updatedFields[key];
      }
    }

    await user.save();

    res.status(200).json(user.family[familyMemberIndex]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a family member for a specific user
UsersRoute.delete("/:userId/family/:familyMemberId", async (req, res) => {
  const userId = req.params.userId;
  const familyMemberId = req.params.familyMemberId;

  try {
    const user = await UsersModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const familyMemberIndex = user.family.findIndex(
      (member) => member._id.toString() === familyMemberId
    );

    if (familyMemberIndex === -1) {
      return res.status(404).json({ message: "Family member not found" });
    }

    user.family.splice(familyMemberIndex, 1);
    await user.save();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports={
    UsersRoute
}