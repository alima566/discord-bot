const mongoose = require("mongoose");
const reqString = {
  type: String,
  required: true,
};

const commandPrefixSchema = mongoose.Schema(
  {
    // Guild ID
    _id: reqString,
    prefix: reqString,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("guild-prefixes", commandPrefixSchema);
