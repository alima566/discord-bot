const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const muteSchema = mongoose.Schema(
  {
    guildID: reqString,
    userID: reqString,
    reason: reqString,
    executor: reqString,
    timestamp: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    current: {
      type: Boolean,
      required: true,
    },
    messageLink: reqString,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("mutes", muteSchema);
