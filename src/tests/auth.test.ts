import { AuthService } from "@/services/auth.service";
import bcrypt from "bcrypt";
import user from "./mock/user.mock.json"
import { AuthController } from "@/controllers/auth.controller";
import { AppDataSource } from "@/database/db.service";
import { User } from "@/entity/user.entity";

const authService = new AuthService();

async function initializeTestApp() {
  await AppDataSource.initialize();
}

describe("Auth Service", () => {
  it("bcrypt.hash should be called", async () => {
    const password = "password";
    bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");
    jest.spyOn(bcrypt, "hash");
    const hashedPassword = await authService.hash(password);
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(hashedPassword).toBe("hashedPassword");
  });

  it("Should return true for a valid bcrypt hash", async () => {
    const password = "password";
    const hashedPassword = "$2a$12$Sfb1/y4FLynRXESMTN0bVOx3c.Do6TueE/Z0ebsZaSm9kpBFTcfeu"; // Hash for "password"

    const isValid = await authService.compare(password, hashedPassword);
    expect(isValid).toBe(true);
  });

  it("Should return false for an invalid password", async () => {
    const password = "invalidPassword";
    const hashedPassword = "$2a$12$Sfb1/y4FLynRXESMTN0bVOx3c.Do6TueE/Z0ebsZaSm9kpBFTcfeu"; // Hash for "password"

    const isValid = await authService.compare(password, hashedPassword);
    expect(isValid).toBe(false);
  });
});

describe("Auth Controller", () => {

  let authController: AuthController;
  const exampleUser = {
    name: user[0].name,
    email: user[0].email,
    password: user[0].password,
    availableStart: user[0].availableStart,
    availableEnd: user[0].availableEnd
  }
  beforeEach(async () => {
    await initializeTestApp();
    authController = new AuthController();
  })

  afterEach(async () => {
    await AppDataSource.destroy();
    authController = undefined;
  })

  it("Should register an user", async () => {

    await authController.register(exampleUser);
    const isUserExisted = await AppDataSource.getRepository(User).exists({
      where: {
        email: exampleUser.email
      }
    });
    expect(isUserExisted).toEqual(true);
  })

  it("Should not register an user => Duplicated email", async () => {

    await authController.register(exampleUser);
    try {
      await authController.register(exampleUser);
      fail();
    } catch (error) {
      expect(error).toEqual(new Error("Email is duplicated"));
    }
  })

  it("Should not register an user => Invalid data", async () => {
    const invalidUsers = [
      //Invalid Email
      {
        ...exampleUser,
        email: "abc"
      },
      {
        ...exampleUser,
        email: ""
      },
      {
        ...exampleUser,
        password: "123"
      },
      {
        ...exampleUser,
        email: "a@a.com",
        password: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" //73 characters
      }
    ]

    for (const invalidUser of invalidUsers) {
      try {
        await authController.register(invalidUser);
        fail();
      } catch (error) {
        expect(error).toEqual(new Error("Validation Error"));
      }
    }
  })
});