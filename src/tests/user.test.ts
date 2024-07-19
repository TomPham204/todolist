/*
UserServervice
- create
- getOneByEmail
*/

import { AppDataSource } from "@/database/db.service";
import user from "./mock/user.mock.json"
import { UserService } from "@/services/user.service";
import { User } from "@/entity/user.entity";

let userService: UserService;
async function initializeTestApp() {
    await AppDataSource.initialize();
}

describe("User Service", () => {

    beforeEach(async () => {
        await initializeTestApp();
        userService = new UserService;
    });

    afterEach(async () => {
        await AppDataSource.destroy();
        userService = undefined;
    })

    it("Should create a user", async () => {
        const exampleUser = {
            name: user[0].name,
            email: user[0].email,
            password: user[0].password,
            availableStart: user[0].availableStart,
            availableEnd: user[0].availableEnd
        }

        const createdUserId = await userService.createUser(exampleUser);
        const insertedUser = await AppDataSource.getRepository(User).findOne({
            where: {
                id: createdUserId.raw
            }
        });
        expect(insertedUser.email).toEqual(exampleUser.email);
    })

    it("Should throw an error when email has been duplicated", async () => {
        const exampleUser = {
            name: user[0].name,
            email: user[0].email,
            password: user[0].password,
            availableStart: user[0].availableStart,
            availableEnd: user[0].availableEnd
        }

        await userService.createUser(exampleUser);
        try {
            await userService.createUser(exampleUser);
            fail();
        } catch (error) {
            expect(error).toBeInstanceOf(Error);

        }
    });
})