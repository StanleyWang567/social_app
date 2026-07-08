import 'dotenv/config'
import { PrismaClient } from '@prisma/client' // <-- Clean standard import
import { PrismaNeon } from '@prisma/adapter-neon'
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})
export const prisma = new PrismaClient({ adapter })