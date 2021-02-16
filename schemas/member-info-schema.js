const mongoose = require("mongoose");
const reqString = {
  type: String,
  required: true,
};

const memberInfoSchema = mongoose.Schema({
  guildID: reqString,
  userID: reqString,
  warnings: {
    type: [Object],
    required: true,
  },
  mutes: {
    type: [Object],
    required: true,
  },
  kicks: {
    type: [Object],
    required: true,
  },
  bans: {
    type: [Object],
    required: true,
  },
  unbans: {
    type: [Object],
    required: true,
  },
});

module.exports = mongoose.model("member-info", memberInfoSchema);
