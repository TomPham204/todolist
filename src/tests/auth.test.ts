import { AuthService } from "@/services/auth.service";
import bcrypt from "bcrypt";
import user from "./mock/user.mock.json"
import { AuthController } from "@/controllers/auth.controller";
import { AppDataSource } from "@/database/db.service";
import { User } from "@/entity/user.entity";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import dotenv from "dotenv";
import { z } from "zod";
import { CreateUserDto, LoginUserDto } from "@/dto/user.dto";
dotenv.config();

const authService = new AuthService();

async function initializeTestApp() {
  await AppDataSource.initialize();
}

async function insertSampleUser(user: z.infer<typeof CreateUserDto>) {
  user.password = await bcrypt.hash(user.password, 12);
  await AppDataSource.createQueryBuilder().insert().into(User).values(user).execute();
}

describe("Auth Service", () => {
  const jwtPayload = {
    sub: 1,
    email: "a@a.com"
  };

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

  it("jwt.sign should be called", async () => {
    jest.spyOn(jwt, "sign");
    const token = authService.encode(jwtPayload);
    expect(jwt.sign).toHaveBeenCalled();
    expect(typeof token).toBe("string");
  });

  it("jwt.verify should be called", async () => {
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
      algorithm: "HS256"
    });
    jest.spyOn(jwt, "verify");
    const decoded = authService.decode(token);
    expect(jwt.verify).toHaveBeenCalled();
    expect(decoded).toMatchObject(jwtPayload);
  });

  it("Should throw an error for invalid token", async () => {
    expect(() => authService.decode("invalidToken")).toThrow();
  }
  );
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
    const invalidUsers: z.infer<typeof CreateUserDto>[] = [
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
      },
      {
        ...exampleUser,
        availableStart: "",
        availableEnd: ""
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

  it("Should be login", async () => {
    const sampleUser = {
      name: user[0].name,
      email: user[0].email,
      password: user[0].password,
      availableStart: user[0].availableStart,
      availableEnd: user[0].availableEnd
    }

    await insertSampleUser(sampleUser); //Create a user

    const exampleUser = {
      email: user[0].email,
      password: user[0].password,
    }

    const token = await authController.login(exampleUser);
    const payload = JSON.parse(atob(token.split(".")[1]));
    expect(payload.email).toEqual(exampleUser.email);
  })

  it("Should not login => Email or password is incorrect", async () => {
    const sampleUser = {
      name: user[0].name,
      email: user[0].email,
      password: user[0].password,
      availableStart: user[0].availableStart,
      availableEnd: user[0].availableEnd
    }
    
    await insertSampleUser(sampleUser); //Create a user

    const exampleUser = {
      email: user[0].email,
      password: user[0].password,
    }

    const invalidUsers: z.infer<typeof LoginUserDto>[] = [
      {
        ...exampleUser,
        email: "notExistEmail@a.com"
      },
      {
        ...exampleUser,
        password: "wrongPassword"
      }
    ];

    for (const invalidUser of invalidUsers) {
      try {
        await authController.login(invalidUser);
        fail();
      } catch (error) {
        expect(error).toEqual(new Error("Email or password is incorrect"));
      }
    }
  })
});