const mongoose = require('mongoose');

const { Schema } = mongoose;

const FactorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('factories', FactorySchema);
