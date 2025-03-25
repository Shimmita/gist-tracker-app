import connectDB from "@/lib/connectDB";
import UserModel from "@/models/UserSchema";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Handle POST requests
export async function POST(req: Request) {
  await connectDB();

  try {
    const { name, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    // Save user to the database
    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 400 }
    );
  }
}
