import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

console.log("Environment loaded. Checking vars:");
console.log("PORT:", process.env.PORT);
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Configure CORS with proper origin handling
const defaultFrontend = "https://fullstack-chat-app-bdc-messenger.vercel.app";
const corsOrigin = process.env.NODE_ENV === "production" 
  ? (process.env.FRONTEND_URL || defaultFrontend)
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url)
  : true;

console.log("CORS Origin configured:", corsOrigin);

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

// Import routes dynamically to avoid circular import issues
const routesModule = await import('./routes/index.js');
app.use('/api', routesModule.default);

// Frontend is hosted separately on Vercel; avoid serving dist here to prevent ENOENT

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});

server.on("error", (err) => {
  console.error("Server error:", err);
});

