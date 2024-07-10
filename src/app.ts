import { AppDataSource } from "./database/db.service";
import { router as todoRouter } from "./routes/todo.route";
import "reflect-metadata";
import express from "express";

const port = 3005;
const app = express();

app.use(express.json());
app.use("/todo", todoRouter);

AppDataSource.initialize()
	.then(() => {
		console.log("DB connected");
	})
	.catch((err) => {
		console.log("DB connection error: ", err);
		process.exit(1);
	});
