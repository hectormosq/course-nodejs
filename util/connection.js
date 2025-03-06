import dotenv from "dotenv";

dotenv.config();

const user = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGODB_CLUSTER;
const db = process.env.MONGODB_DB;

export const connectionParam = `mongodb+srv://${user}:${password}@${cluster}/${db}`;
