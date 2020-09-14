const validateError = (response, message) => {
  expect(response.body).toBeDefined();
  expect(response.body.error).toBeDefined();
  expect(response.body.error.message).toEqual(message);
};

const validateRequiredErrors = (response, location, field, value, message) => {
  expect(response.body).toBeDefined();
  expect(response.body.errors).toBeDefined();
  expect(response.body.errors).toHaveLength(1);
  expect(response.body.errors[0].location).toEqual(location);
  expect(response.body.errors[0].param).toEqual(field);
  expect(response.body.errors[0].value).toEqual(value);
  expect(response.body.errors[0].msg).toEqual(message);
};

module.exports = {
  validateError,
  validateRequiredErrors,
};
