module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	globals: {
		'ts-jest': {
			isolatedModules: true,
		},
		__test: true,
		__config: {},
	},
	moduleNameMapper: {
		'~/(.*)': '<rootDir>/src/$1',
		'\\.txt$': '<rootDir>/src/list.mock.ts',
	},
	rootDir: '.',
	collectCoverageFrom: ['src/**/*.{js,ts}'],
};
