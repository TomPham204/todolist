import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "../database/db.service";
import { QueryFailedError, Repository } from "typeorm";
import { User } from "@/entity/user.entity";
import { userRouter } from "@/routes/user.route";
import { UserService } from "@/services/user.service";
import { UserController } from "@/controllers/user.controller";
import { StatusCodes } from 'http-status-codes'

const app = express();
let userService: UserService;
let userController: UserController;
let userRepository: Repository<User>;
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
		email: "a@a.com",
		password: "hello"
	});
}

beforeAll(async () => {
	await initializeTestApp();
	initDependencies();
});

const initDependencies = () => {
	userRepository = AppDataSource.getRepository("User");
	userService = new UserService(userRepository);
	userController = new UserController(userService);
}

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
			email: "a@a.com",
			password: "hello"
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
		expect(result.body.message).toEqual("Invalid ID");
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

describe("USER DELETE API TEST", () => {
	beforeEach(async () => {
		await addUser();
	});

	it("/:id - Should delete user by id success", async () => {
        const response = await request(app).delete("/user/1");
        const actualResponse = response.body.message;

        expect(actualResponse).toEqual("success");
        expect(response.statusCode).toEqual(200);
    });

    it("/:id - Should delete user fail when invalid id", async () => {
        const response = await request(app).delete("/user/asdfasdf");
        const actualResponse = response.body.message;

        expect(actualResponse).toEqual("Invalid ID");
        expect(response.statusCode).toEqual(400);
    });

    it("/:id - Should delete user fail when path incorrect", async () => {
        const response = await request(app).delete("/user/");
        expect(response.statusCode).toEqual(404);
    });

    it("/:id - Should delete user fail when it not exists", async () => {
        const response = await request(app).delete("/user/2");
        const actualResponse = response.body.message;

        expect(actualResponse).toEqual("User not exists");
        expect(response.statusCode).toEqual(400);
    });
});

describe("USER DELETE SERVICE AND REPOSITORY TEST", () => {
    // Data initialize
    const currentDateStr = new Date().toISOString();
    let user: User = {
		id: 3,
		name: "example",
		availableStart: currentDateStr,
		availableEnd: currentDateStr,
		email: "a@a.com",
		password: "hello"
	};

    it("/:id - Should delete user successfully", async () => {
		// BEGIN
		const expected = 1;
		const userResponse = await userRepository.save(user);

		// WHEN
		const actualResult = (await userService.deleteUserById(userResponse.id)).affected;
		expect(actualResult).toEqual(1);

		// THEN
		expect(actualResult).toBe(1);
		expect(actualResult).toEqual(expected);
    });

    it("/:id - Should delete user fail when invalid id and not exists", async () => {
		// BEGIN
		const repoCases = [
			{
				id: "-1@",
				expectedMsg: "no such column",
			},
			{
				id: -1,
				expectedMsg: "no such column",
			},
		];

		const serviceCases = [
			{
				id: "-1@",
				expectedMsg: "Invalid id",
				expectedMsgCtrl: "Invalid ID",
			},
			{
				id: -1,
				expectedMsg: "User not exists",
				expectedMsgCtrl: "User not exists",
			}
		];

		repoCases.forEach(async (user) => {
			try {
				// WHEN
				await userRepository.delete(Number(user.id));
	
			} catch (error) {
				// THEN
				let err = error as QueryFailedError;
				const actualMsg = err.message.split(":")[1].trim();
				expect(actualMsg).toEqual(user.expectedMsg);
	
			}
		});

		serviceCases.forEach(async (user) => {
			try {
				// WHEN
				await userService.deleteUserById(Number(user.id));
	
			} catch (error) {
				// THEN
				const err = error as Error;
				const actualMsg = err.message;
				expect(actualMsg).toEqual(user.expectedMsg);
				
			}
		});
    });
});

describe("USER DELETE CONTROLLER AND SERVICE TEST", () => {
	// Data initialize
	const OK = StatusCodes.OK;
	const currentDateStr = new Date().toISOString();
	let user: User = {
		id: 3,
		name: "example",
		availableStart: currentDateStr,
		availableEnd: currentDateStr,
		email: "a@a.com",
		password: "hello"
	};

	it("/:id - Should delete user successfully", async () => {
		// BEGIN
		const expectedMsg = "success";
		const response = await userService.createUser(user);

		// WHEN
		const { message, statusCode } = await userController.deleteUserById(response.id);
		
		// THEN
		expect(OK).toEqual(statusCode);
		expect(message).toEqual(expectedMsg);
    });

    it("/:id - Should delete user fail when invalid id and not exists", async () => {
		// BEGIN
		const cases = [
			{
				id: "-1@",
				expectedMsg: "Invalid id",
				expectedMsgCtrl: "Invalid ID",
			},
			{
				id: -1,
				expectedMsg: "User not exists",
				expectedMsgCtrl: "User not exists",
			}
		]

		cases.forEach(async (user) => {
			try {
				// WHEN
				await userService.deleteUserById(Number(user.id));

			} catch (error) {
				// THEN
				const err = error as Error;
				const actualErr = err.message;
				expect(actualErr).toEqual(user.expectedMsg);
			}
			
			// WHEN
			const response = await request(app).delete(`/user/${user.id}`);
        	const actualResponse = response.body.message;
			
			// THEN
			expect(actualResponse).toBe(user.expectedMsgCtrl);
		});
    });
});