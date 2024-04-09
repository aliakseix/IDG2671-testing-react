import react from '@vitejs/plugin-react';
import { defineConfig } from "vitest/config";

import dotenv from "dotenv";
import path from "path";

const __dirname = import.meta.dirname;
dotenv.config({ path: path.join(__dirname, "..", ".env") });

export default defineConfig({
	test: {
		environment: "jsdom",
		setupFiles: "./test/setup.js"
	},
	plugins: [react()],
});