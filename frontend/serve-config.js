/* eslint-env node */
import dotenv from "dotenv";
import path from "path";

const __dirname = import.meta.dirname;
dotenv.config({ path: path.join(__dirname, "..", ".env") });

export default {
	port: process.env.FRONTEND_PORT,
	single: "./dist"
};