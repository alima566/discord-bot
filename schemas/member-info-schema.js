const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const reqObject = {
  type: [Object],
  required: true,
};

const memberInfoSchema = mongoose.Schema({
  guildID: reqString,
  userID: reqString,
  warnings: reqObject,
  mutes: reqObject,
  kicks: reqObject,
  softbans: reqObject,
  bans: reqObject,
  unbans: reqObject,
});

module.exports = mongoose.model("member-info", memberInfoSchema);
