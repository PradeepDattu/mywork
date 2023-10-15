// app.js
const express = require("express");
const { YoutubeModel } = require("../Model/Youtube");
const YoutubeRoute = express.Router();

// Create a new YouTube link
YoutubeRoute.post("/", async (req, res) => {
  try {
    const youtubeLink = new YoutubeModel(req.body);
    await youtubeLink.save();
    res.status(201).json(youtubeLink);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not save the YouTube link." });
  }
});

// Update YouTube links (using PUT request)
YoutubeRoute.put("/", async (req, res) => {
  try {
    const existingLinks = await YoutubeModel.findOne();
    if (!existingLinks) {
      // If there are no existing links, create a new document
      const youtubeLink = new YoutubeModel(req.body);
      await youtubeLink.save();
      res.status(201).json(youtubeLink);
    } else {
      // Update the existing document with the new links
      existingLinks.set(req.body);
      await existingLinks.save();
      res.json(existingLinks);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update YouTube links." });
  }
});

// Get existing YouTube links
YoutubeRoute.get("/", async (req, res) => {
  try {
    const youtubeLinks = await YoutubeModel.findOne();
    res.json(youtubeLinks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch YouTube links." });
  }
});

module.exports = {
  YoutubeRoute,
};
