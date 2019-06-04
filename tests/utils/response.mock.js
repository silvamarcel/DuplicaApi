/* eslint no-param-reassign: ["error", { "props": false }] */
module.exports = expectedValues => ({
  status: (status) => {
    expectedValues.status = status;
    const send = (message) => {
      expectedValues.message = message;
    };
    return { send };
  },
});
