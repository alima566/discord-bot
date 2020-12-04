const mongoose = require("mongoose");
const reqString = {
  type: String,
  required: true,
};

const botChannelSchema = mongoose.Schema({
  // Guild ID
  _id: reqString,
  channelID: reqString,
});

module.exports = mongoose.model("bot-channels", botChannelSchema);
