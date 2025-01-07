import { z } from "zod"

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

