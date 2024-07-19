import { AuthService } from "@/services/auth.service";
import bcrypt from "bcrypt";
const authService = new AuthService();

describe("Auth Service", () => {
  it("Should create a valid bcrypt hash", async () => {
    const password = "password";
    bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");
    jest.spyOn(bcrypt, "hash");
    const hashedPassword = await authService.hash(password);
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(hashedPassword).toBe("hashedPassword");
  });

  it("Should compare a valid bcrypt hash", async () => {
    const password = "password";
    const hashedPassword = "$2a$12$Sfb1/y4FLynRXESMTN0bVOx3c.Do6TueE/Z0ebsZaSm9kpBFTcfeu";

    const isValid = await authService.compare(password, hashedPassword);
    expect(isValid).toBe(true);
  });
});