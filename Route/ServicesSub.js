const express = require("express");
const { ServicesSubModel } = require("../Model/ServicesSub");
const { ServicesMainModel } = require("../Model/ServicesMain");
const ServicesSub = express.Router();

ServicesSub.get("/", async (req, res) => {
  try {
    const data = await ServicesSubModel.find();
    res.send(data);
  } catch {
    res.send("Error");
  }
});

ServicesSub.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await ServicesSubModel.find({ _id: id });
    res.send(data);
  } catch {
    res.send("Error");
  }
});

ServicesSub.post("/", async (req, res) => {
  const payload = req.body;
  try {
    let datall = [];
    for (let dataobj = 0; dataobj < payload.length; dataobj++) {
      const dataMain = await ServicesMainModel.findOne({
        smname: payload[dataobj].mainname,
      });
      const id = dataMain._id;
      const data = new ServicesSubModel({ ...payload[dataobj], mainId: id });
      datall.push(data);
      await data.save();
    }

    res.send(datall);
  } catch {
    res.send("Post ERRoR");
  }
});

ServicesSub.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await ServicesSubModel.findByIdAndDelete({ _id: id });
    res.send("Delete Success");
  } catch {
    res.send("error delete");
  }
});

ServicesSub.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  try {
    await ServicesSubModel.findByIdAndUpdate({ _id: id }, payload);
    res.send("Update Success");
  } catch {
    res.send("error Update");
  }
});

module.exports = {
  ServicesSub,
};
