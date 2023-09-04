const axios = require("axios");
const express = require("express");
const { PanchamModel } = require("../Model/Pancham");
const pancham = express.Router();
// pancham.post("/", async (req, res) => {

//   const currentDate = new Date();
//   const day = currentDate.getDate();
//   const month = currentDate.getMonth() + 1;
//   const year = currentDate.getFullYear();
//   const formattedDate = `${day}/${month}/${year}`;

//   try {
//     const data = await PanchamModel.find();
//     const { date } = data[0];
//     if (date == formattedDate) {
//       res.send("Data already present");
//     } else {
//       if (date) {
//         await PanchamModel.deleteOne({ _id: data[0]._id });
//       }
//       fetchAndStoreData(formattedDate);

//       res.send("post");
//     }
//   } catch {
//     res.send("error");
//   }
// });
pancham.get("/", async (req, res) => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  try {
    const data = await PanchamModel.find();

    const { date } = data[0] || "30/07/2023";
    if (date == formattedDate) {
      res.send(data);
    } else {
      if (date) {
        await PanchamModel.deleteOne({ _id: data[0]._id });
      }
      fetchAndStoreData(formattedDate, res);
      // const Data = await PanchamModel.find();
      // res.send(Data);
    }
  } catch (error) {
    res.send("Errr");
    console.log(error);
  }
});
module.exports = {
  pancham,
};

async function fetchAndStoreData(formattedDate, res) {
  try {
    const currentDate = new Date();
    const formattedDateTime = currentDate.toISOString();

    console.log(formattedDateTime);
    const { access_token } = await getAccessToken();

    const response = await axios.get(
      `https://api.prokerala.com/v2/astrology/panchang/advanced?ayanamsa=1&coordinates=14.442599,79.986458&datetime=${formattedDateTime}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    // Store data in the database
    const data = { data: response.data.data };
    const newData = new PanchamModel({ ...data, date: formattedDate });
    await newData.save();
    res.send([data]);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}
async function getAccessToken() {
  try {
    const response = await axios.post("https://api.prokerala.com/token", {
      grant_type: "client_credentials",
      client_id: "a617db27-a719-4b0b-881f-e247ca31d082", // Replace with your actual client ID
      client_secret: "IF15U6uvmibYFwgAIluyQLzc31IRNFQg4Ln4FTxN", // Replace with your actual client secret
    });

    return response.data;
  } catch (error) {
    console.error("Access token request failed:", error);
    throw error;
  }
}
