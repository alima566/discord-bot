const mongoose = require("mongoose");
const reqString = {
  type: String,
  required: true,
};
const gamblingChannelSchema = mongoose.Schema({
  // Guild ID
  _id: reqString,
  channelID: reqString,
});

module.exports = mongoose.model("gambling-channels", gamblingChannelSchema);
