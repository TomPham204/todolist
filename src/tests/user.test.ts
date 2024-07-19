import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { userRouter } from "../routes/user.route";
import { AppDataSource } from "../database/db.service";
import { User } from "@/entity/user.entity";
import { UserService } from "@/services/user.service";
import { Repository } from "typeorm";

const app = express();
const userService = new UserService();
app.use(bodyParser.json());
app.use("/user", userRouter);

const userRepository: Repository<User> = AppDataSource.getRepository(
    "User"
)
async function initializeTestApp() {
    await AppDataSource.initialize();
}

beforeAll(async () => {
    await initializeTestApp();
});

describe("User API", () => {
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
        const newUser = await userRepository.save(user);
        const updatedName = "abc";
        const result = await request(app)
            .put("/user/" +  newUser.id)
            .send({ ...user, name: updatedName });
        expect(result.statusCode).toEqual(200);
    });

    it("PUT /user/:id - failed, invalid ID", async () => {
        const user = {
            name: "test",
            availableStart: "13:25",
            availableEnd: "13:45",
        };
        const newUser = await userRepository.save(user);
        const updatedName = "abc";
        const result = await request(app)
            .put("/user/123abc0")
            .send({ ...user, name: updatedName });
        expect(result.statusCode).toEqual(400)
        expect(result.body.message).toBe("Invalid ID");
    });

    it("PUT /user/:id - failed, invalid body", async () => {
        const user = {
            name: "test",
            availableStart: "13:25",
            availableEnd: "13:45",
        };
        const newUser = await userRepository.save(user);
        const result = await request(app)
            .put("/user/"+ newUser.id)
            .send({});
        expect(result.statusCode).toEqual(400);
        expect(result.body.message).toBe("Invalid body");
    });
});
