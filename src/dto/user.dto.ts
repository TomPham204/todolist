import z from "zod"

export const CreateUserDto = z.object({
    email: z.string().email(),

    password: z.string().min(6).max(72),

    name: z.string(),

    availableStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),

    availableEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
})

export const LoginUserDto = z.object({
    email: z.string().email(),

    password: z.string(),
})