"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { FaSun, FaMoon } from "react-icons/fa";
import AppLogo from "../images/gist.png";
import ProfileModal from "./ProfileModal";
import { BsPersonCircle } from "react-icons/bs";
const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") === "dark";
    setDarkMode(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme);
  }, []);

  const toggleTheme = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
  };

  return (
    <>
      <nav>
        <div className="bg-blue-400/50 dark:bg-gray-800 items-center p-3 flex justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold flex items-center gap-3">
            <Image
              src={AppLogo}
              alt="Gist Tracker Logo"
              width={50}
              height={50}
              className="rounded-full aspect-square object-cover hidden md:block"
            />
            <h5 className="text-white dark:text-gray-200 font-bold text-lg">
              Gist Tracker
            </h5>
          </Link>

          {/* Auth Links & Controls */}
          <div className="flex gap-2.5 md:gap-5 items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded transition duration-300 ease-in-out"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FaSun
                  size={18}
                  className="text-yellow-400 hover:text-yellow-500"
                />
              ) : (
                <FaMoon
                  size={18}
                  className="text-gray-300 hover:text-gray-500"
                />
              )}
            </button>

            {session ? (
              <>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-400 dark:text-red-300 rounded p-1 font-semibold"
                >
                  Logout
                </button>

                <button onClick={() => setIsProfileOpen(true)}>
                  {!session.user ? (
                    <BsPersonCircle size={24} />
                  ) : (
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {session.user?.name
                        ? session.user.name[0].toUpperCase()
                        : "U"}
                    </div>
                  )}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-blue-50 dark:text-gray-300 rounded p-1 font-semibold"
                >
                  Login
                </Link>
                <div className="hidden md:block">|</div>
                <Link
                  href="/auth/register"
                  className="text-blue-50 dark:text-gray-300 hidden md:block rounded p-1"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      {isProfileOpen && (
        <ProfileModal onClose={() => setIsProfileOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
