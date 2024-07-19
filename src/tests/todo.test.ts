import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { todoRouter } from "../routes/todo.route";
import { AppDataSource } from "../database/db.service";

const app = express();
app.use(bodyParser.json());
app.use("/todo", todoRouter);

async function initializeTestApp() {
	await AppDataSource.initialize();
}

beforeAll(async () => {
	await initializeTestApp();
});

describe("Todo API", () => {
	it("POST /todo - has startDate, has endDate, success", async () => {
		const todo = {
			name: "Test Todo success",
			startDate: "2023-01-01",
			endDate: "2023-01-02",
		};
		const result = await request(app).post("/todo").send(todo);
		expect(result.statusCode).toEqual(201);
	});

	it("POST /todo - no startDate, no endDate, success", async () => {
		const todo = {
			name: "Test Todo success",
		};
		const result = await request(app).post("/todo").send(todo);
		expect(result.statusCode).toEqual(201);
	});

	it("POST /todo - no startDate, has endDate, failure", async () => {
		const todo = {
			name: "Test Todo",
			endDate: "2023-01-02",
		};
		const result = await request(app).post("/todo").send(todo);
		expect(result.statusCode).toEqual(400);
		expect(result.body.message).toEqual(
			"Start date is required if end date is provided"
		);
	});

	it("GET /todo - success", async () => {
		const result = await request(app).get("/todo");
		expect(result.statusCode).toEqual(200);
		expect(result.body).toBeInstanceOf(Array);
	});

	it("GET /todo/:id - success", async () => {
		const result = await request(app).get("/todo/1");
		expect(result.statusCode).toEqual(200);
	});

	it("GET /todo/:id - failure", async () => {
		const result = await request(app).get("/todo/9999");
		expect(result.statusCode).toEqual(404);
		expect(result.body.message).toEqual("Todo not found");
	});

	it("POST /todo - invalid startDate format, failure", async () => {
		const todo = {
			name: "Test Todo",
			startDate: "2023-01-01T00:00:00Z",
			endDate: "2023-01-02",
		};
		const result = await request(app).post("/todo").send(todo);
		expect(result.statusCode).toEqual(400);
		expect(result.body.message).toEqual("Invalid startDate format");
	});

	it("POST /todo - invalid endDate format, failure", async () => {
		const todo = {
			name: "Test Todo",
			startDate: "2023-01-01",
			endDate: "2023-01-02T00:00:00Z",
		};
		const result = await request(app).post("/todo").send(todo);
		expect(result.statusCode).toEqual(400);
		expect(result.body.message).toEqual("Invalid endDate format");
	});

	it("GET /todo/:id - SQL injection, failure", async () => {
		const result = await request(app).get("/todo/1; DROP TABLE todo");
		expect(result.statusCode).toEqual(403);
		expect(result.body.error).toEqual("Invalid ID");
	});

	it("PUT /todo/:id - invalid startDate format, failure", async () => {
		const todo = {
			name: "Updated Test Todo",
			startDate: "2023-01-01T00:00:00Z",
			endDate: "2023-01-02",
		};
		const result = await request(app).put("/todo/1").send(todo);
		expect(result.statusCode).toEqual(400);
		expect(result.body.message).toEqual("Invalid startDate format");
	});

	it("PUT /todo/:id - invalid endDate format, failure", async () => {
		const todo = {
			name: "Updated Test Todo",
			startDate: "2023-01-01",
			endDate: "2023-01-02T00:00:00Z",
		};
		const result = await request(app).put("/todo/1").send(todo);
		expect(result.statusCode).toEqual(400);
		expect(result.body.message).toEqual("Invalid endDate format");
	});

	it("PUT /todo/:id - success", async () => {
		const todo = {
			name: "Updated Test Todo",
			startDate: "2023-01-01",
			endDate: "2023-01-02",
		};
		const result = await request(app).put("/todo/1").send(todo);
		expect(result.statusCode).toEqual(200);
	});

	it("DELETE /todo/:id - success", async () => {
		const result = await request(app).delete("/todo/1");
		expect(result.statusCode).toEqual(204);
	});
});
