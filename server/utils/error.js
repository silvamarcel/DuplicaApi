const APIErrorName = 'APIError';
const buildError = (err, status, message) => {
  let error = err;
  if (!error) {
    error = new Error('Unknown error');
  }
  error.name = APIErrorName;
  if (status) {
    error.status = status;
  }
  if (message) {
    error.message = message;
  }
  return error;
};

module.exports = {
  buildError,
};
