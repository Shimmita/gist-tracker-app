import { Schema, model, models } from "mongoose";

// Gist schema with updated fields
const gistSchema = new Schema(
  {
    // title should be unique for all gists
    title: { type: String, required: true, unique:true },
    description: { type: String, required: false },
    code: { type: String, required: true },

    // unique id which is email of the user who created the gist
    userId: { type: String, required: true }, 
  },
  { timestamps: true }
);

// Export the model
const GistModel = models.Gist || model("Gist", gistSchema);

export default GistModel;
