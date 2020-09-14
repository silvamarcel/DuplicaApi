module.exports = {
  verbose: true,
  testEnvironment: 'node',
  unmockedModulePathPatterns: [
    './node_modules/lodash',
    './node_modules/mongoose',
  ],
  testPathIgnorePatterns: ['tests/utils'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  collectCoverageFrom: ['server/**/*.js', 'src/**/*.js'],
  coveragePathIgnorePatterns: [
    'server/health.js',
    'server/log/logger.js',
    'server/store/database.js',
    'server/middleware/appMiddleware.js',
  ],
};
