const mongoose = require("mongoose");
const reqString = {
  type: String,
  required: true,
};
const gamblingSchema = mongoose.Schema({
  guildID: reqString,
  userID: reqString,
  points: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("points", gamblingSchema);
