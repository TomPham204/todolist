import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "../database/db.service";
import { Repository } from "typeorm";
import { User } from "@/entity/user.entity";
import { userRouter } from "@/routes/user.route";
import { UserService } from "@/services/user.service";

const app = express();
let userService: UserService;
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

afterEach(async () => {
	await AppDataSource.createQueryBuilder().delete().from(User).execute();
});

describe("User service test", () => {
	userService = new UserService();

	it("Should get user by id, success", async () => {
		await addUser();
		const user = await userService.getUserById(1);
		expect(user).not.toBeNull();
		expect(user?.id).toEqual(1);
	});

	it("Should get user by id, failed, invalid id", async () => {
		const user = await userService.getUserById(999);
		expect(user).toBeNull();
	});
});

describe("User route", () => {
    it("POST /user - success", async () => {
        const user = {
            name: "test",
            availableStart: "13:25",
            availableEnd: "13:45",
        };
        const result = await request(app).post("/user").send(user);
        expect(result.statusCode).toEqual(201);
    });

    it("POST /user - failed, invalid body", async () => {
        const result = await request(app).post("/user").send({});
        expect(result.statusCode).toEqual(400);
    });

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

	it("DELETE /user/:id - Should delete user by id success", async () => {
		await addUser();
		const response = await request(app).delete("/user/1");
		const actualResponse = response.body.message;

		expect(actualResponse).toEqual("success");
		expect(response.statusCode).toEqual(200);
	});

	it("GET /user - has user success", async () => {
		const result = await request(app).get("/user");
		expect(result.body).toBeInstanceOf(Array);
	});

	it("PUT /user/:id - success", async () => {
		const user = {
			name: "test",
			availableStart: "13:25",
			availableEnd: "13:45",
		};
		await addUser();
		const updatedName = "abc";
		const result = await request(app)
			.put("/user/1")
			.send({ ...user, name: updatedName });
		expect(result.statusCode).toEqual(200);
	});

	it("PUT /user/:id - failed, invalid ID", async () => {
		const user = {
			name: "test",
			availableStart: "13:25",
			availableEnd: "13:45",
		};
		await addUser();
		const updatedName = "abc";
		const result = await request(app)
			.put("/user/123abc0")
			.send({ ...user, name: updatedName });
		expect(result.statusCode).toEqual(400);
		expect(result.body.message).toBe("Invalid ID");
	});

	it("PUT /user/:id - failed, invalid body", async () => {
		const newUser = await addUser();
		const result = await request(app).put("/user/1").send({});
		expect(result.statusCode).toEqual(400);
		expect(result.body.message).toBe("Invalid body");
	});
});
