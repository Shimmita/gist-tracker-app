"use client";
import { useCallback, useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";

type Gist = {
  _id: string;
  title: string;
  description: string;
  code: string;
  createdAt: string;
};

export default function UserGists() {
  const [gists, setGists] = useState<Gist[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedGist, setSelectedGist] = useState<Gist | null>(null);
  const [editingGist, setEditingGist] = useState<Gist | null>(null);

  // Fetch user gists
  const fetchGists = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gists/user`);
      const data = await res.json();
      if (res.ok) setGists(data.gists);
      else console.error(data.message);
    } catch (error) {
      console.error("Failed to load gists:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGists();
  }, [fetchGists]);

  // Delete Gist
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this gist?")) {
      const res = await fetch(`/api/gists/delete/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchGists();
      }
      alert("Failed to delete gist");
    }
  };

  // Open Update Modal
  const handleUpdate = (gist: Gist) => setEditingGist(gist);

  // Submit Updated Gist
  const submitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // set loading true
    setLoading(true);

    if (editingGist) {
      const res = await fetch(`/api/gists/update/${editingGist._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingGist.title,
          code: editingGist.code,
          description: editingGist.description,
        }),
      });
      if (res.ok) {
        // false loading
        setLoading(false);
        fetchGists();
      } else {
        // false loading
        setLoading(false);
        alert("Failed to update gist");
      }

      setEditingGist(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Code copied to clipboard!");
  };

  // Open Full View Modal
  const handleView = (gist: Gist) => setSelectedGist(gist);

  // Close Modals
  const handleClose = () => {
    setSelectedGist(null);
    setEditingGist(null);
  };

  // Filter gists based on search term
  const filteredGists = gists.filter(
    (gist) =>
      gist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gist.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gist.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl text-center font-bold mb-4">My Gists</h1>

      {/* Search Input */}
      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Search gists..."
          className="w-full max-w-lg p-2 rounded bg-gray-800 text-white placeholder-gray-500 mb-3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {filteredGists.length === 0 ? (
            <p className="text-center text-gray-400">No matching gists found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {filteredGists.map((gist) => (
                <div
                  key={gist._id}
                  className="p-4 rounded bg-gray-800 shadow-md max-w-md mx-auto w-full"
                >
                  <h2 className="text-2xl font-semibold mb-1 text-blue-400">
                    {gist.title}
                  </h2>
                  <p className="text-gray-400 mb-2">{gist.description}</p>

                  <div className="relative bg-gray-900 p-3 rounded text-sm text-green-300">
                    <BiCopy
                      size={20}
                      className="absolute top-2 left-2 cursor-pointer text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(gist.code)}
                    />
                    <div className="p-8">
                      <pre className="overflow-hidden max-h-24 whitespace-pre-wrap line-clamp-4">
                        {gist.code}
                      </pre>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between mt-2 text-sm text-gray-300">
                    <span
                      className="cursor-pointer hover:text-blue-400"
                      onClick={() => handleView(gist)}
                    >
                      View
                    </span>
                    <span
                      className="cursor-pointer hover:text-yellow-400"
                      onClick={() => handleUpdate(gist)}
                    >
                      Update
                    </span>
                    <span
                      className="cursor-pointer hover:text-red-400"
                      onClick={() => handleDelete(gist._id)}
                    >
                      Delete
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* View Modal */}
      {selectedGist && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full text-white">
            <h2 className="text-2xl font-bold">{selectedGist.title}</h2>
            <p className="my-4">{selectedGist.description}</p>
            <pre className="bg-gray-900 p-4 rounded whitespace-pre-wrap overflow-y-auto">
              {selectedGist.code}
            </pre>
            <button className="text-zinc-400 mt-4" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {editingGist && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <form
            className="bg-gray-800 p-6 rounded-lg max-w-md w-full text-white"
            onSubmit={submitUpdate}
          >
            <input
              type="text"
              value={editingGist.title}
              onChange={(e) =>
                setEditingGist({ ...editingGist, title: e.target.value })
              }
              className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
              placeholder="Title"
            />
            <textarea
              value={editingGist.description}
              onChange={(e) =>
                setEditingGist({ ...editingGist, description: e.target.value })
              }
              className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
              placeholder="Description"
            />
            <textarea
              value={editingGist.code}
              onChange={(e) =>
                setEditingGist({ ...editingGist, code: e.target.value })
              }
              className="w-full h-50 mb-2 p-2 rounded bg-gray-700 text-white"
              placeholder="Code snippet"
            />
            <div className="flex justify-between">
              <button className="text-blue-400" type="submit">
                {loading ? "processing.." : "save"}
              </button>
              <button className="text-zinc-400" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
