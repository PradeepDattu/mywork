const mongoose = require("mongoose");

const gallerySchema = mongoose.Schema({
    imageSrc: { type: String, required: true },
    date: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true }
});

const GalleryModel = mongoose.model("Gallery", gallerySchema);

module.exports = {
  GalleryModel,
};
