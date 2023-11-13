module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	maxWorkers: 1,
	transform: {
		"^.+\\.ts?$": "ts-jest",
	},
	transformIgnorePatterns: ["<rootDir>/node_modules/"],
	testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/cli/"],
};
