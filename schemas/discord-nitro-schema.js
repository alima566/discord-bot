const mongoose = require("mongoose");
const reqString = {
  type: String,
  required: true,
};

const discordNitroSchema = mongoose.Schema({
  // Guild ID
  _id: reqString,
  nitroLink: reqString,
});

module.exports = mongoose.model("discord-nitro-links", discordNitroSchema);
