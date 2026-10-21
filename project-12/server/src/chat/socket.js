import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import {
  getConversation,
  conversationHasUser,
  otherParticipant,
  saveMessage,
} from "./chatController.js";

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Missing auth token"));
    }
    try {
      const payload = jwt.verify(token, env.jwtSecret);
      const user = await User.findById(payload.id);
      if (!user) return next(new Error("User not found"));
      socket.user = { id: user.id, name: user.name, role: user.role };
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.id}`);

    socket.on("conversation:join", async (conversationId) => {
      const conversation = await getConversation(conversationId);
      if (!conversation || !conversationHasUser(conversation, socket.user.id)) {
        socket.emit("chat:error", "You are not part of this conversation");
        return;
      }
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("conversation:leave", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on("message:send", async ({ conversationId, text }) => {
      if (!text || !text.trim()) return;

      try {
        const conversation = await getConversation(conversationId);
        if (
          !conversation ||
          !conversationHasUser(conversation, socket.user.id)
        ) {
          socket.emit("chat:error", "You are not part of this conversation");
          return;
        }

        const message = await saveMessage({
          conversationId,
          senderId: socket.user.id,
          text: text.trim(),
        });

        const payload = message.toJSON();

        io.to(`conversation:${conversationId}`).emit("message:new", payload);

        const recipientId = otherParticipant(conversation, socket.user.id);
        if (recipientId) {
          io.to(`user:${recipientId}`).emit("notification:new", {
            conversationId,
            from: socket.user.name,
            text: payload.text,
            createdAt: payload.createdAt,
          });
        }
      } catch (error) {
        socket.emit("chat:error", "Could not send message");
      }
    });

    socket.on("typing", ({ conversationId, isTyping }) => {
      socket.to(`conversation:${conversationId}`).emit("typing", {
        userId: socket.user.id,
        name: socket.user.name,
        isTyping,
      });
    });
  });

  return io;
}
