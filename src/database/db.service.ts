import { join } from "path";
import { DataSource } from "typeorm";
const sqlite3 = require("sqlite3").verbose();

// I know the entities[] array is a bit redundant, I throw everything at it while trying to resolve the error Unable to resolve signature of property decorator when called as an expression.

export const AppDataSource = new DataSource({
	type: "sqlite",
	database: ":memory:",
	synchronize: true,
	logging: false,
	entities: [join(__dirname, "../entity/*.entity{.ts,.js}")],
});
