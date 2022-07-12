import type { Config } from '@jest/types';
// import type { InitialOptionsTsJest } from 'ts-jest';
// import { defaults as tsjPreset } from 'ts-jest/presets';

// Sync object

export default {
	verbose: true,
	moduleDirectories: ["node_modules", "src"],
	globals: {
		"ts-jest": {
			isolatedModules: true,
		},
	},
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	preset: "ts-jest",
	testEnvironment: 'node',
};
