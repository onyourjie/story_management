import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import path from "node:path";

const isTest =
  process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID !== undefined;

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
if (isTest) {
  dotenv.config({
    path: path.resolve(__dirname, "../../.env.test"),
    override: true,
  });
}

const databaseUrl = isTest
  ? process.env.DATABASE_URL_TEST
  : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    isTest
      ? "DATABASE_URL_TEST is required when running tests"
      : "DATABASE_URL is required"
  );
}

if (isTest && process.env.DATABASE_URL && databaseUrl === process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL_TEST must be different from DATABASE_URL");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

export default prisma;
