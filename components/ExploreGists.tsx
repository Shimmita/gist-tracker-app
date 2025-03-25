import { fetchGists } from "@/utils/fetchGists";
import { useEffect, useState } from "react";

// defines the structure of individual gist result or data, for type safety
type Gist = {
  id: string;
  description: string;
  html_url: string;
  owner: { login: string; avatar_url: string };
  files: { [key: string]: { filename: string; language: string } };
};

//function that highlights the matched the search result. it matches matching texts
const highlightMatch = (text: string, query: string) => {
  // if no  means no text for matching or highlight
  if (!query) return text;

  // regex that performs actual matching
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(
    regex,
    (match) =>
      `<span class="bg-yellow-400 text-black font-semibold">${match}</span>`
  );
};

const GistExplorer = () => {
  const [gists, setGists] = useState<Gist[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("description");

  const loadGists = async (pageNumber: number) => {
    setLoading(true);
    const data = await fetchGists(pageNumber, 8);
    setGists(data);
    setLoading(false);
  };

  useEffect(() => {
    loadGists(page);
  }, [page]);

  // 🔍 Enhanced filtering function — now supports author & "match-anywhere"
  const filteredGists = gists.filter((gist) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();

    switch (searchType) {
      case "description":
        return (
          gist.description?.toLowerCase().includes(query) ||
          gist.owner.login.toLowerCase().includes(query)
        );

      case "filetype":
        return Object.values(gist.files).some((file) =>
          file.filename.toLowerCase().includes(query)
        );

      case "language":
        return Object.values(gist.files).some((file) =>
          file.language?.toLowerCase().includes(query)
        );

      case "author":
        return gist.owner.login.toLowerCase().includes(query);

      case "any": // 💥 Match in ANY field
        return (
          gist.description?.toLowerCase().includes(query) ||
          gist.owner.login.toLowerCase().includes(query) ||
          Object.values(gist.files).some(
            (file) =>
              file.filename.toLowerCase().includes(query) ||
              file.language?.toLowerCase().includes(query)
          )
        );

      default:
        return false;
    }
  });

  return (
    <div className="p-6 text-white">
      {/* Search Bar */}
      <form className="mb-10 flex gap-3">
        <div
          className="pe-2 w-full"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="p-3 rounded bg-gray-600/40 text-white w-80 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Dropdown to select search type */}
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-2 bg-gray-800 text-white rounded"
        >
          <option value="any">All</option>
          <option value="description">Description</option>
          <option value="filetype">File Type</option>
          <option value="language">Language</option>
          <option value="author">Author</option>
        </select>
      </form>

      {/* Gist Display */}
      {loading ? (
        <p className="text-gray-400 text-center mb-3">
          Fetching gists page {page}...
        </p>
      ) : filteredGists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGists.map((gist) => (
            <div key={gist.id} className="bg-gray-800 p-4 rounded shadow">
              {/* Highlighted Description */}
              <h3
                className="text-lg font-semibold"
                dangerouslySetInnerHTML={{
                  __html: highlightMatch(
                    gist.description || "No Description",
                    searchQuery
                  ),
                }}
              />
              {/* Highlighted Author */}
              <p className="text-sm text-gray-400">
                By:{" "}
                <span
                  className="text-blue-400 font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(gist.owner.login, searchQuery),
                  }}
                />
              </p>

              {/* File details with highlights */}
              <ul className="text-sm mt-2">
                {Object.values(gist.files).map((file, index) => (
                  <li key={index} className="text-gray-400">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(file.filename, searchQuery),
                      }}
                    />{" "}
                    (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(
                          file.language || "Unknown",
                          searchQuery
                        ),
                      }}
                    />
                    )
                  </li>
                ))}
              </ul>

              <a
                href={gist.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline mt-2 block"
              >
                View Gist
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-100 grid place-items-center text-gray-400">
          <p>No gists found.</p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page <= 1}
          className={`px-4 py-2 rounded ${
            page <= 1
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          Previous
        </button>

        <span className="text-gray-400">Page {page}</span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GistExplorer;
