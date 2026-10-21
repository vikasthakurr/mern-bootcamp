import Redis from "ioredis";
import { env } from "./env.js";

let client = null;

export function connectRedis() {
  if (!env.redisUrl) {
    console.warn("[redis] REDIS_URL not set - caching is disabled");
    return null;
  }

  if (client) {
    return client;
  }

  client = new Redis(env.redisUrl, {
    maxRetriesPerRequest: 2,
    lazyConnect: false,
  });

  client.on("connect", () => console.log("[redis] connected"));
  client.on("error", (err) => console.error("[redis] error:", err.message));

  return client;
}

export function getRedis() {
  return client;
}

export async function cacheGet(key) {
  if (!client) return null;
  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
}

export async function cacheSet(key, value, ttlSeconds = 60) {
  if (!client) return;
  await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
}
