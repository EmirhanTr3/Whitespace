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
        .min(2, { message: 'Minimum 2 characters.' })
        .max(32, { message: 'Maximum 32 characters.' })
        .regex(/^[a-z0-9._]+$/, { message: 'No uppercase or special characters.' })
        .trim(),
    displayname: z
        .string()
        .min(2, { message: 'Minimum 2 characters.' })
        .max(32, { message: 'Maximum 32 characters.' })
        .trim(),
    email: z
        .string()
        .email({ message: 'Please enter a valid email.' })
        .trim(),
    password: z
        .string()
        .min(8, { message: 'Minimum 8 characters.' })
        .regex(/[a-zA-Z]/, { message: 'Have at least one letter.' })
        .regex(/[0-9]/, { message: 'Have at least one number.' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Have at least one special character.' })
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