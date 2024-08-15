import { z } from 'zod'
 
export const LoginFormSchema = z.object({
    email: z
        .string()
        .email({ message: 'Please enter a valid email.' })
        .trim(),
    password: z
        .string()
        .min(1, { message: 'Please enter a password.' })
        .trim(),
})

export const RegisterFormSchema = z.object({
    username: z
        .string()
        .min(2, { message: 'Username must be at least 2 characters long.' })
        .max(32, { message: 'Username must be below 32 characters long.' })
        .regex(/[a-z0-9]/, { message: 'Usernames cannot contain uppercase and special characters.' })
        .trim(),
    displayname: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .max(32, { message: 'Name must be below 32 characters long.' })
        .trim(),
    email: z
        .string()
        .email({ message: 'Please enter a valid email.' })
        .trim(),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character.' })
        .trim(),
})
 
export type FormState =
  | {
      errors?: {
        username?: string[]
        displayname?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined