import { PrismaClient } from '@prisma/client'
import { hash } from 'crypto'

export const prisma = new PrismaClient()

export function hashPassword(password: string) : string {
    return hash("sha256", password)
}