import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const mongoUrl = getRequiredEnv("MONGODB_URL");
const authSecret = getRequiredEnv("BETTER_AUTH_SECRET");
const authBaseURL = getRequiredEnv("BETTER_AUTH_URL");

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

const client = globalForMongo.mongoClient ?? new MongoClient(mongoUrl);
if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db("bazardor");

export const auth = betterAuth({
  baseURL: authBaseURL,
  secret: authSecret,
  trustedOrigins: [new URL(authBaseURL).origin],
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
});