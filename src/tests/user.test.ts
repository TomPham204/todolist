import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "../database/db.service";
import { Repository } from "typeorm";
import { User } from "@/entity/user.entity";
import { userRouter } from "@/routes/user.route";

const app = express();
app.use(bodyParser.json());
app.use("/user", userRouter);

async function initializeTestApp() {
    await AppDataSource.initialize();
}

async function addUser() {
	const userRepository: Repository<User> = AppDataSource.getRepository("User");
	await userRepository.save({
		id: 1,
		name: "John Doe",
		availableStart: "11:30",
		availableEnd: "12:30",
	});
}

beforeAll(async () => {
    await initializeTestApp();
});

describe("Test user API", () => {
    it("GET /user/:id - success", async () => {
		await addUser();
		const result = await request(app).get("/user/1");
		expect(result.statusCode).toEqual(200);
	});

	it("GET /user/:id - failure, user not found", async () => {
		const result = await request(app).get("/user/9999");
		expect(result.statusCode).toEqual(404);
		expect(result.body.message).toEqual("User not found");
	});

	it("GET /user/:id - failure, invalid id", async () => {
		const result = await request(app).get("/user/abc");
		expect(result.statusCode).toEqual(400);
		expect(result.body.message).toEqual("Invalid user id");
	});

    it("DELETE /user/:id - Should delete user fail when invalid id", async () => {
        const response = await request(app).delete("/user/asdfasdf");
        const actualResponse = response.body.message;

        expect(actualResponse).toEqual("Invalid Id");
        expect(response.statusCode).toEqual(400);
    });

    it("DELETE /user/:id - Should delete user fail when path incorrect", async () => {
        const response = await request(app).delete("/user/");
        expect(response.statusCode).toEqual(404);
    });

    it("DELETE /user/:id - Should delete user fail when it not exists", async () => {
        const response = await request(app).delete("/user/2");
        const actualResponse = response.body.message;

        expect(actualResponse).toEqual("User not exists");
        expect(response.statusCode).toEqual(400);
    });
});
