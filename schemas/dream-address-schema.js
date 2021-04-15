const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const dreamAddressSchema = mongoose.Schema({
  //Guild ID
  _id: reqString,
  dreamAddress: reqString,
});

module.exports = mongoose.model("dream-addresses", dreamAddressSchema);
