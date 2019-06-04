const authController = require('./authController');

describe('Authentication Controller API', () => {
  it('Should get an error when sign in', async () => {
    const req = { user: {} };
    const res = jest.fn();
    const next = jest.fn();
    authController.signin(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
