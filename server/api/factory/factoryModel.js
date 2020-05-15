const mongoose = require('mongoose');
const { address, contact } = require('../schemas');

const { Schema } = mongoose;

const FactorySchema = new Schema({
  businessId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  contract: {
    type: String,
    required: true,
    unique: true,
  },
  address,
  contact,
});

module.exports = mongoose.model('factories', FactorySchema);
