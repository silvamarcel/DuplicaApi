const mongoose = require('mongoose');
const { address, contact } = require('./schemas');

const { Schema } = mongoose;

const CompanySchema = new Schema({
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
  bankInformation: {
    branch: {
      type: String,
      required: true,
      maxLength: 10,
    },
    account: {
      type: String,
      required: true,
      maxLength: 10,
    },
    agreement: {
      type: String,
      required: true,
      maxLength: 7,
    },
    portfolio: {
      type: String,
      required: true,
      maxLength: 2,
    },
    variation: {
      type: String,
      required: true,
      maxLength: 3,
    },
    interest: {
      type: String,
      required: true,
      maxLength: 15,
    },
    instruction1: {
      type: String,
      required: true,
      maxLength: 2,
    },
    instruction2: {
      type: String,
      required: true,
      maxLength: 2,
    },
  },
  taxInformation: {
    accumulated: {
      pis: {
        type: String,
        required: true,
        maxLength: 15,
      },
      cofins: {
        type: String,
        required: true,
        maxLength: 15,
      },
      irrf: {
        type: String,
        required: true,
        maxLength: 15,
      },
      iof: {
        type: String,
        required: true,
        maxLength: 15,
      },
    },
    tax: {
      pis: {
        type: String,
        required: true,
        maxLength: 15,
      },
      cofins: {
        type: String,
        required: true,
        maxLength: 15,
      },
      irrf: {
        type: String,
        required: true,
        maxLength: 15,
      },
      iof: {
        type: String,
        required: true,
        maxLength: 15,
      },
      additionalIof: {
        type: String,
        required: true,
        maxLength: 15,
      },
    },
    code: {
      pis: {
        type: Number,
        required: true,
      },
      cofins: {
        type: Number,
        required: true,
      },
      irrf: {
        type: Number,
        required: true,
      },
      iof: {
        type: Number,
        required: true,
      },
    },
  },
  address,
  contact,
});

module.exports = mongoose.model('companies', CompanySchema);
