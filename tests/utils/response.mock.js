/* eslint no-param-reassign: ["error", { "props": false }] */
module.exports = expectedValues => ({
  status: (status) => {
    expectedValues.status = status;
  },
  json: (message) => {
    expectedValues.message = message.error.message;
  },
});
