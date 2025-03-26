"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import CodeSnippetLogo from "../images/code_snippet.png";
import Link from "next/link";

function HeroSection() {
  const { data: session } = useSession(); // Get user session

  return (
    <section className="text-white py-20">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12">
        {/* Content on the left */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-10">
            Track & Share Your{" "}
            <span className="text-blue-400">Code Snippets</span> Easily
          </h1>
          <p className="text-gray-300 mt-5">
            Create, manage, and explore gists effortlessly. GitHub integration
            for seamless workflow to access numerous public APIs globally.
          </p>

          {/* Buttons based on user session */}
          <div className="mt-6 flex justify-center md:justify-start space-x-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg font-semibold"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg font-semibold"
              >
                Get Started
              </Link>
            )}

            <Link
              href="/gists/all"
              className="border border-gray-300 text-gray-300 hover:text-white hover:border-white px-6 py-3 rounded text-lg font-semibold"
            >
              Explore Gists
            </Link>
          </div>
        </div>

        {/* Code snippet image to the right for visual impression */}
        <div className="md:w-1/2 flex justify-center">
          <Image
            src={CodeSnippetLogo}
            alt="Gist Tracker Illustration"
            width={500}
            height={400}
            className="drop-shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
