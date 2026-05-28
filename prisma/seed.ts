import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3307,
  user: "appuser",
  password: "apppassword",
  database: "university_db",
  connectionLimit: 5,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12)

  await prisma.user.upsert({
    where: { email: "admin@university.edu" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@university.edu",
      hashedPassword,
      role: "admin",
    },
  })

  await prisma.user.upsert({
    where: { email: "editor@university.edu" },
    update: {},
    create: {
      name: "Editor",
      email: "editor@university.edu",
      hashedPassword,
      role: "editor",
    },
  })

  console.log("Seeded admin (admin@university.edu) and editor (editor@university.edu) — password: admin123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
