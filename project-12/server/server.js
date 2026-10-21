import http from "http";
import app from "./src/app.js";
import { env } from "./src/config/env.js";
import { connectDB } from "./src/config/db.js";
import { connectRedis } from "./src/config/redis.js";
import { configureCloudinary } from "./src/config/cloudinary.js";
import { initSocket } from "./src/chat/socket.js";

async function start() {
  await connectDB();
  connectRedis();
  configureCloudinary();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(env.port, () => {
    console.log(`TalentBridge API running on http://localhost:${env.port}`);
    console.log(`Socket.IO chat ready`);
  });
}

start();
