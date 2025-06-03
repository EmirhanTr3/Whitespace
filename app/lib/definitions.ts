import { createServerFn } from '@tanstack/react-start'
import { resolveMx } from 'dns/promises'
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

const checkEmailMxRecord = createServerFn()
    .validator(d => d as { domain: string })
    .handler(async data => {
        const mx = await resolveMx(data.data.domain).catch(() => undefined)
        return mx != undefined
    })

export const RegisterFormSchema = z.object({
    name: z
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
        .refine(email => {
            const domain = email.split("@")[1]
            if (!domain) return false;
            return checkEmailMxRecord({ data: { domain } })
        }, 'Please use a valid email provider.'),
    password: z
        .string()
        .min(8, { message: 'Minimum 8 characters.' })
        .regex(/[a-zA-Z]/, { message: 'Have at least one letter.' })
        .regex(/[0-9]/, { message: 'Have at least one number.' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Have at least one special character.' })
        .trim(),
})

export const CreateGuildFormSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Server name cannot be empty.' })
        .max(32, { message: 'Maximum 32 characters.'})
        .trim()
})

export const CreateChannelFormSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Channel name cannot be empty.' })
        .max(32, { message: 'Maximum 32 characters.'})
        .trim()
})

export type FormState =
  | {
      errors?: {
        name?: string[]
        displayname?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined