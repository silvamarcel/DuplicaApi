const APIErrorName = 'APIError';

const statusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
};

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
  statusCodes,
};
