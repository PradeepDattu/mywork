const mongoose = require("mongoose");

const gallerySchema = mongoose.Schema({
    imageSrc: { type: String },
    date: { type: String },
    title: { type: String},
    text: { type: String}
});

const GalleryModel = mongoose.model("Gallery", gallerySchema);

module.exports = {
  GalleryModel,
};
