import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/connectDB";
import GistModel from "@/models/GistSchema";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }



    await connectDB();

    const userGists = await GistModel.find({ userId: session.user?.email })
      .sort({ createdAt: -1 });

    

    return NextResponse.json({
      gists: userGists,
     
    });
  } catch (error) {
    console.error("Failed to fetch gists:", error);
    return NextResponse.json(
      { message: "Failed to fetch gists" },
      { status: 500 }
    );
  }
}
