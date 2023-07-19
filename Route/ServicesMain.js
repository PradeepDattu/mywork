const express = require("express");
const { ServicesMainModel } = require("../Model/ServicesMain");
const { ServicesSubModel } = require("../Model/ServicesSub");
const ServicesMain = express.Router();

ServicesMain.get("/", async (req, res) => {
  try {
    const data = await ServicesMainModel.find();
    res.send(data);
  } catch {
    res.send("Error");
  }
});


ServicesMain.post("/",async(req,res)=>{
    const payload=req.body
    try{
       const data =new ServicesMainModel(payload)
       await data.save()
       res.send(data)
    }
    catch{
        res.send("Post ERROR")
    }
})

ServicesMain.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await ServicesSubModel.deleteMany({ mainId: id });
    await ServicesMainModel.findByIdAndDelete({ _id: id });
    res.send("Delete Success");
  } catch {
    res.send("Delete Error");
  }
});

ServicesMain.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const payload=req.body
  try {
    await ServicesMainModel.findByIdAndUpdate({ "_id": id },payload);
    res.send("Update Success");
  } catch {
    res.send("error Update");
  }
});

module.exports = {
  ServicesMain,
};
