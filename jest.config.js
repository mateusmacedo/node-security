module.exports = {
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/$1'
  },
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  testEnvironment: 'node',
  coverageReporters: ['json-summary', 'text', 'lcov'],
  testResultsProcessor: 'jest-sonar-reporter',
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: 80
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/src/**/main.{js,jsx,ts,tsx}',
    '!<rootDir>/src/**/index.{js,jsx,ts,tsx}',
    '!<rootDir>/src/**/*.module.{js,jsx,ts,tsx}',
    '!<rootDir>/src/**/*.interface.{js,jsx,ts,tsx}',
    '!<rootDir>/src/**/*.*spec.{js,jsx,ts,tsx}',
    '!<rootDir>/src/**/*.mock.{js,jsx,ts,tsx}'
  ]
}
