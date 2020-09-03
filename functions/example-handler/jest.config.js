module.exports = {
  preset: 'ts-jest',
  reporters: ['default', ['jest-junit', { outputDirectory: '../test-reports/' }]],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    'test/util',
  ],
  testPathIgnorePatterns: [
    'test/util',
    'test/*/*.d.ts',
  ],
  coverageDirectory: 'test-reports/',
};
