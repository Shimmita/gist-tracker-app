"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

// Define form schema
const gistSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  code: z.string().min(1, "Code snippet is required"),
});

// Define form data type
type GistFormData = z.infer<typeof gistSchema>;

// Form component
export default function GistForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GistFormData>({
    resolver: zodResolver(gistSchema),
  });

  // Form submission handler
  const onSubmit = async (data: GistFormData) => {
    setLoading(true);

    try {
      const res = await fetch("/api/gists/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Gist created successfully!");
        onClose();
      } else {
        alert(result.message || "Failed to create gist");
      }
    } catch (error) {
      console.error("Error creating gist:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed m-1 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-2xl font-bold mb-4 text-white">Create New Gist</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Title"
            {...register("title")}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}

          {/* Description Input */}
          <textarea
            placeholder="Description (optional)"
            {...register("description")}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          {/* Code Snippet Input — Enlarged */}
          <textarea
            placeholder="Code snippet"
            {...register("code")}
            className="w-full p-2 h-45 rounded bg-gray-700 text-white"
          />
          {errors.code && <p className="text-red-500">{errors.code.message}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 mt-2 ${
              loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            } text-white font-semibold rounded`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Gist"}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 mt-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
