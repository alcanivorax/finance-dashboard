import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      password: "alice",
      role: "VIEWER",
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
  main()
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
}
