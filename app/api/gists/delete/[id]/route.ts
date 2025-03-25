import { NextResponse } from "next/server";
import GistModel from "@/models/GistSchema";
import connectDB from "@/lib/connectDB";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    // dynamically extract the passed id in params
  const { id } = params;
//   connect database
  await connectDB();

  try {
    const deletedGist = await GistModel.findByIdAndDelete(id);

    if (!deletedGist) return NextResponse.json({ message: "Gist not found" }, { status: 404 });

    return NextResponse.json({ message: "Gist deleted successfully" }, { status: 200 });
  } catch (error) {
    // debug error
    console.log(error)
    // return response to the frontend
    return NextResponse.json({ message: "Failed to delete gist" }, { status: 500 });
  }
}
