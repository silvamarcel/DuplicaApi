const mongoose = require('mongoose');

const { Schema } = mongoose;

const ContactSchema = new Schema({
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
});

module.exports = ContactSchema;
