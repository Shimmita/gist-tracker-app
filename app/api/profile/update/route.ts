import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/connectDB";
import UserModel from "@/models/UserSchema";
import { authOptions } from "@/lib/authOptions";
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const { name, email, password } = await req.json();

    if (!name || !email) return NextResponse.json({ message: "Name and email are required" }, { status: 400 });

    await connectDB();

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    user.name = name;
    user.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
