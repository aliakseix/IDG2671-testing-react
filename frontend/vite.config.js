/* eslint-env node */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from "dotenv";
import path from "path";

const __dirname = import.meta.dirname;
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    port: process.env.FRONTEND_PORT
  },
  plugins: [react()],
  define: {
    "process.env": process.env
  }
});
