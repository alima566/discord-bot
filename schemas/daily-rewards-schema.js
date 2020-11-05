const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const dailyRewardsSchema = mongoose.Schema(
  {
    guildID: reqString,
    userID: reqString,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("daily-rewards", dailyRewardsSchema);
