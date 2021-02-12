const mongoose = require("mongoose");
const reqString = {
  type: String,
  required: true,
};

const memberInfoSchema = mongoose.Schema({
  guildID: reqString,
  userID: reqString,
  warns: [
    {
      warnedBy: reqString,
      reason: {
        type: String,
      },
      messageLink: reqString,
      warnedDate: {
        type: Date,
        required: true,
      },
    },
  ],
  kicks: [
    {
      kickedBy: reqString,
      reason: {
        type: String,
      },
      messageLink: reqString,
      kickedDate: {
        type: Date,
        required: true,
      },
    },
  ],
  bans: [
    {
      bannedBy: reqString,
      reason: {
        type: String,
      },
      messageLink: reqString,
      bannedDate: {
        type: Date,
        required: true,
      },
    },
  ],
  unbans: [
    {
      unbannedBy: reqString,
      reason: {
        type: String,
      },
      messageLink: reqString,
      unbannedDate: {
        type: Date,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("member-info", memberInfoSchema);
