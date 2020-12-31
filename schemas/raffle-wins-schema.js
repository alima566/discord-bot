const mongoose = require("mongoose");
const reqString = {
  type: String,
  required: true,
};

const raffleWinsSchema = mongoose.Schema({
  guildID: reqString,
  userID: reqString,
  raffleWins: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("raffle-wins", raffleWinsSchema);
