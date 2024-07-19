import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./database/db.service";

import { todoRouter } from "./routes/todo.route";
import { authRouter } from "./routes/auth.route";
import { userRouter } from "./routes/user.route";

const port = 3005;
const app = express();

app.use(express.json());
app.use("/todo", todoRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

AppDataSource.initialize()
	.then(() => {
		app.listen(port);
	})
	.catch((err) => {
		console.log("DB connection error: ", err);
		process.exit(1);
	});
