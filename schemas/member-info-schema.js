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
      unbannedDate: {
        type: Date,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("member-info", memberInfoSchema);
