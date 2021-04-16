const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const uidSchema = mongoose.Schema({
  //Guild ID
  _id: reqString,
  uid: reqString,
});

module.exports = mongoose.model("uids", uidSchema);
