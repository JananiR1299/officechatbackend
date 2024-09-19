import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import Messages from "./MessageModel";
import Chats from "./ChatModel";
import Files from "./FileModel";

// Load environment variables from .env file
dotenv.config();

// Ensure that DATABASE_URL is defined
const databaseUrl =
  process.env.DATABASE_URL ||
  "mssql://mssqldb:mssqldb@321@localhost:1433/chatapp";
console.log("databaseUrl", databaseUrl);
if (!databaseUrl || databaseUrl.trim() === "") {
  throw new Error("DATABASE_URL is not set. Exiting...");
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: "mssql",
  // models: [Messages, Chats, Files],
  dialectOptions: {
    options: {
      encrypt: true, // Use this if you're on Windows Azure
      trustServerCertificate: true, // Use this for self-signed certificates
    },
  },
});

export default sequelize;
