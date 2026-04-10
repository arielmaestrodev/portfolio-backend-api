import crypto from "crypto";

const ITERATIONS = 120000;
const KEYLEN = 64;
const DIGEST = "sha512";

// Hash Password
export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString("hex");
  return `${salt}:${ITERATIONS}:${derived}`;
}

// Password Verifier
export function verifyPassword(password: string, stored: string) {
  const [salt, iterStr, hash] = stored.split(":");
  const iters = parseInt(iterStr, 10);
  const derived = crypto.pbkdf2Sync(password, salt, iters, KEYLEN, DIGEST).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"));
}