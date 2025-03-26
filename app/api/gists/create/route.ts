import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import GistModel from "@/models/GistSchema";
import connectDB from "@/lib/connectDB";
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, code } = await req.json();

    // Ensure clean, URL-safe titles (replace spaces with hyphens)
    const formattedTitle = title.trim().replace(/\s+/g, "-");

    //connect to the mongo database 
    await connectDB();

    const newGist = new GistModel({
      title: formattedTitle,
      description,
      code,
      userId: session.user?.email,
    });

    const savedGist = await newGist.save();

    return NextResponse.json(savedGist, { status: 201 });
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { message: "Failed to create gist" },
      { status: 500 }
    );
  }
}
