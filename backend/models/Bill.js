const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  name: String,
  datetime: String,
  desc: String,
  email: String
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
