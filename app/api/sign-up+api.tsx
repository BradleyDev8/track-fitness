import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export async function POST(request: Request){
    const {email, password} = await request.json();

    console.log(email, password);
    // TODO validate email and password
    if (!email || !password){
        return Response.json({error: "Email and password are required"}, {status: 400});
    }

    if (password.length < 8){
        return Response.json({error: "Password must be at least 8 characters long"}, {status: 400});
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
        return Response.json({error: "Invalid email"}, {status: 400});
    }

    // 2, look up user by email in database
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    })

    // 3. if user exists, return error
    if (user){
        return Response.json({error: "User already exists"}, {status: 400});
    }
    // 4. create user in database
    const newUser = await db.insert(users).values({
        email,
        password: await bcryptjs.hash(password, 10),
    }).returning();

    // 5. create jwt token
    const token = jwt.sign({id: newUser[0].id}, process.env.JWT_SECRET!);

    return Response.json({token});
}