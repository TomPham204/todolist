import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "../database/db.service";
import { Repository } from "typeorm";
import { User } from "@/entity/user.entity";
import { UserService } from "@/services/user.service";
import { UserController } from "@/controllers/user.controller";

const app = express();
let userService: UserService;
app.use(bodyParser.json());

async function initializeTestApp() {
    await AppDataSource.initialize();
}

async function addUser() {
    const userRepository: Repository<User> = AppDataSource.getRepository("User");
    const user = await userRepository.save({
        id: 1,
        name: "John Doe",
        email: "test@gmail.com",
        password: "123",
        availableStart: "11:30",
        availableEnd: "12:30",
    });
    return user;
}

beforeAll(async () => {
    await initializeTestApp();
});

afterEach(async () => {
    await AppDataSource.createQueryBuilder().delete().from(User).execute();
});

describe("User service test", () => {
    const userController = new UserController();

    it('Should update user by id, success', async () => {
        await addUser();
        const updateData = {
            id: 1,
            name: "James",
            email: "test@gmail.com",
            password: "123",
            availableStart: "11:30",
            availableEnd: "12:30",
        };

        const result = await userController.updateUserById('1', updateData)
        expect(result.affected).toEqual(1)
    })

    it('Should not update user by id, fail', async () => {
        await addUser();
        const updateData = {
            id: 1,
            name: "James",
            email: "test@gmail.com",
            password: "123",
            availableStart: "11:30",
            availableEnd: "12:30",
        };
        expect(async () => { await userController.updateUserById('9999', updateData) }).rejects.toThrow();
    })

    it('Should get all user, success', async () => {
        const result = await userController.getUsers()
        expect(result).toBeInstanceOf(Array)
    })
})