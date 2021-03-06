const mongoose = require("mongoose");

// Upload Model
// Template for Upload objects in the db
let Upload = new mongoose.Schema({
  image_title: String,
  image_description: String,
  image_URL: String,
  userId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model("Upload", Upload);
