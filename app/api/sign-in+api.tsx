import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
        return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find user by email
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    // If user doesn't exist or password doesn't match
    if (!user || !(await bcryptjs.compare(password, user.password))) {
        return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);

    return Response.json({ token });
}