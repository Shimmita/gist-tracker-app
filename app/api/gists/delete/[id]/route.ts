import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import GistModel from "@/models/GistSchema";
import connectDB from "@/lib/connectDB";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    await connectDB();

    const deletedGist = await GistModel.findOneAndDelete({
      _id: id,
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
