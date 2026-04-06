import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/prisma/client";
import { hashPassword } from "@/src/utils/hashPassword";

const password = process.env.SEED_PASSWORD!;

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function seed() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      password: await hashPassword(password),
      role: "ADMIN",
      status: "ACTIVE",

      records: {
        create: [
          {
            amount: 99.99,
            type: "INCOME",
            category: "Salary",
            notes: "First income",
            date: new Date(),
          },
        ],
      },
    },
  });

  console.log({ alice });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
