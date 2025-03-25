"use client";
import GistForm from "@/components/GistForm";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";
import { GoFileDirectoryFill } from "react-icons/go";

export default function DashBoardHome() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showGistForm, setShowGistForm] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/");
  }, [status, router]);

  // function to create gists
  const handleShowCreateGistForm = () => {
    setShowGistForm(true);
  };
  return (
    <section className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome {session?.user?.name || "Guest"} 👋
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Track your gists, ideas, and projects — all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <button
          onClick={handleShowCreateGistForm}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-lg shadow-md text-center"
        >
          <CgAdd size={26} className="ps-2" /> Create New Gist
        </button>

        <Link
          href="/gists/user"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-lg shadow-md text-center"
        >
          <GoFileDirectoryFill size={26} className="ps-2" /> View My Gists
        </Link>

        <Link
          href="/gists/all"
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 rounded-lg shadow-md text-center"
        >
          <BiSearch size={26} className="ps-2" /> Explore Gists
        </Link>
      </div>
      {/* shown for creating form */}
      {showGistForm && <GistForm onClose={() => setShowGistForm(false)} />}
    </section>
  );
}
