const mongoose = require('mongoose');

const { Schema } = mongoose;

const AddressSchema = new Schema({
  zipCode: {
    type: Number,
  },
  address: {
    type: String,
  },
  complement: {
    type: String,
  },
  neighborhood: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
});

module.exports = AddressSchema;
