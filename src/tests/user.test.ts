/*
UserServervice
- create
- getOneByEmail
*/

import { AppDataSource } from "@/database/db.service";
import user from "./mock/user.mock.json"
import { UserService } from "@/services/user.service";

const userService = new UserService();
async function initializeTestApp() {
	await AppDataSource.initialize();
}

beforeAll(async () => {
	await initializeTestApp();
});

describe("User Service", () => {
    it("Should create a user", async () => {
        const exampleUser = user[0];

        const createdUser = await userService.createUser(exampleUser);        
        expect(createdUser).toEqual(exampleUser);
    })
})