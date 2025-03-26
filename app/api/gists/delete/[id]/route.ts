import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import GistModel from "@/models/GistSchema";
import connectDB from "@/lib/connectDB";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Ensure the ID is extracted correctly
    if (!params?.id) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    await connectDB();

    // Find and delete only if the user owns the gist
    const deletedGist = await GistModel.findOneAndDelete({
      _id: params.id,
      userId: session.user?.email, 
    });

    if (!deletedGist) {
      return NextResponse.json({ message: "Gist not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Gist deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting gist:", error);
    return NextResponse.json({ message: "Failed to delete gist" }, { status: 500 });
  }
}
