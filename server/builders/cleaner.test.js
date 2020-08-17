const Cleaner = require('./cleaner');

const { getCleanedObject } = Cleaner();

describe('Cleaner', () => {
  it('Should return the object without __v attribute', async () => {
    const object = {
      __v: '12345',
      name: 'Object name',
    };

    expect(getCleanedObject(object)).toEqual({
      name: 'Object name',
    });
  });
});
