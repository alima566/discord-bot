const mongoose = require("mongoose");
const reqString = {
  type: String,
  required: true,
};

const backlogRedemptionSchema = mongoose.Schema({
  // Guild ID
  _id: reqString,
  channelID: reqString,
});

module.exports = mongoose.model("backlog-redemptions", backlogRedemptionSchema);
