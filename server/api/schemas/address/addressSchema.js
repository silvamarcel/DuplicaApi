const mongoose = require('mongoose');

const { Schema } = mongoose;

const AddressSchema = new Schema({
  zipCode: {
    type: Number,
  },
  line1: {
    type: String,
  },
  number: {
    type: String,
  },
  line2: {
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
