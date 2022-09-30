module.exports = {
    resetMocks: true,
    restoreMocks: true,
    preset: 'ts-jest',
    clearMocks: true,
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {
        '^@mocks(.*)$': '<rootDir>/src/mocks/$1',
        '^@errors(.*)$': '<rootDir>/src/utils/errors/$1',
        '^@db(.*)$': '<rootDir>/src/db/$1'
    },
    rootDir: './',
    roots: ['<rootDir>/src/'],
    testEnvironment: 'node',
    testMatch: ['**/?(*.)spec.ts'],
    testPathIgnorePatterns: ['<rootDir>/.esbuild/', '<rootDir>/node_modules/', '<rootDir>/.serverless/']
};