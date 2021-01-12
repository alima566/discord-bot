const mongoose = require("mongoose");
const reqString = {
  type: String,
  required: true,
};

const monthlyWinnersSchema = mongoose.Schema({
  guildID: reqString,
  userID: reqString,
  monthlyWins: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("monthly-winners", monthlyWinnersSchema);
