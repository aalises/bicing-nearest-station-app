module.exports = {
  preset: 'jest-expo',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
  clearMocks: true,
};
