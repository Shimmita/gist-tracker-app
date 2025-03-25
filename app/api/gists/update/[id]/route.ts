import connectDB from "@/lib/connectDB";
import GistModel from "@/models/GistSchema";
import { NextResponse } from "next/server";


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { title, code } = await req.json();

//   db connect
  await connectDB();

  try {
    const updatedGist = await GistModel.findByIdAndUpdate(id, { title, code }, { new: true });

    if (!updatedGist) return NextResponse.json({ message: "Gist not found" }, { status: 404 });

    return NextResponse.json({ gist: updatedGist }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Failed to update gist" }, { status: 500 });
  }
}
