import type { Config } from "jest";
import { defaults } from "jest-config";

const config: Config = {
	moduleFileExtensions: [...defaults.moduleFileExtensions, "mts"],
	transform: {
		"^.+\\.ts$": "ts-jest",
	},
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	roots: ["<rootDir>", "src", "src/tests", "node_modules"],
	rootDir: "./",
	modulePaths: ["<rootDir>"],
	moduleDirectories: ["node_modules", "src", __dirname],
};

export default config;
