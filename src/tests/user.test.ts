import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { userRouter } from "../routes/user.route";
import { AppDataSource } from "../database/db.service";
import { User } from "@/entity/user.entity";
import { error } from "console";
const app = express();
app.use(bodyParser.json());
app.use("/user", userRouter);

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
});
