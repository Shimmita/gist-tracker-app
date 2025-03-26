"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const [processing, setProcessing] = useState(false);

  const router = useRouter();
  const { status } = useSession();

  // check if user authenticated nav to dash
  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    // set processing true
    setProcessing(true);
    const { email, password } = data;

    // using next auth signin
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      // processing false
      setProcessing(false);

      // Redirect after successful login
      router.push("/dashboard");
    } else {
      // processing false
      setProcessing(false);
      
      setErrorMsg("Invalid email or password");
    }
  };

  return (
    <section className="grid place-items-center h-100">
      <div className="p-5 mt-5 rounded-lg shadow-md w-100">
        <h4 className="mb-10 text-center text-2xl font-semibold">Login</h4>

        {processing && (
          <p className="text-center text-green-500">Processing details...</p>
        )}
        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

        <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm ps-1 mb-1">Email</label>
            <input
              {...register("email")}
              type="text"
              className="bg-gray-800 w-full border-white p-5"
              placeholder="email"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm ps-1 mb-1">Password</label>
            <input
              {...register("password")}
              type="password"
              className="bg-gray-800 w-full border-white p-5"
              placeholder="password"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white py-3 rounded font-semibold"
          >
            Login
          </button>
        </form>

        {/* GitHub Login */}
        <div className="mt-6">
          <button
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded flex items-center justify-center gap-2"
            onClick={() => signIn("github")}
          >
            <FaGithub size={24} />
            Login with GitHub
          </button>
        </div>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <span>Don’t have an account?</span>{" "}
          <Link href="/auth/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </section>
  );
}
