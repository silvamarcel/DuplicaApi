const config = require('./config');

describe('config.js', () => {
  it('Should load the test environment as config file', () => {
    process.env.NODE_ENV = 'test';
    expect(config.env).toEqual('testing');
    expect(config.secrets.jwt).toEqual('testingJWTSecret');
  });

  it('Should load the dev environment as config file when the NODE_ENV is not setted', () => {
    delete process.env.NODE_ENV;
    config.init();
    expect(config.env).toEqual('development');
    expect(config.secrets.jwt).toEqual('devJWTSecret');
  });

  it('Should load the dev environment as config file', () => {
    process.env.NODE_ENV = 'dev';
    config.init();
    expect(config.env).toEqual('development');
    expect(config.secrets.jwt).toEqual('devJWTSecret');
  });

  it('Should load the staging environment as config file', () => {
    process.env.NODE_ENV = 'stage';
    config.init();
    expect(config.env).toEqual('staging');
    expect(config.secrets.jwt).toEqual('stagingJWTSecret');
  });

  it('Should load the production environment as config file', () => {
    process.env.NODE_ENV = 'prod';
    config.init();
    expect(config.env).toEqual('production');
    expect(config.secrets.jwt).toEqual(undefined);
  });

  it('Should not load any environment when the NODE_ENV is setted with unknow env', () => {
    process.env.NODE_ENV = 'unknow';
    config.init();
    expect(config.env).toEqual(undefined);
    expect(config.secrets.jwt).toEqual(undefined);
  });
});
