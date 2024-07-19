import z from "zod"

export const CreateUserDto = z.object({
    email: z.string().email(),

    password: z.string().min(6).max(72),

    name: z.string()
})