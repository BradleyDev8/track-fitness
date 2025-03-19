import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

interface JwtPayload {
  userId: string;
  [key: string]: any;
}

/**
 * Hashes a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

/**
 * Compares a password with a hashed password
 */
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcryptjs.compare(password, hashedPassword);
}

/**
 * Generates a JWT token with the given payload
 */
export function generateJwt(payload: JwtPayload): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
}

/**
 * Verifies a JWT token and returns the decoded payload
 */
export function verifyJwt(token: string): JwtPayload {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
}