"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Type for the registration form data
type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// Type for user data payload to backend
type UserDataPayload = {
  name: string;
  email: string;
  password: string;
};

// Zod schema to validate registration data
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();

  // State for handling errors and loading
  const [errorMessage, setErrorMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  // Hook form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Form submit handler
  const onSubmit = async (data: RegisterFormData) => {
    setProcessing(true);

    const { name, email, password } = data;

    const userData: UserDataPayload = {
      name,
      email,
      password,
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (res.ok) {
      setProcessing(false);
      router.replace("/auth/login");
      return;
    }

    setProcessing(false);
    const result = await res.json();
    setErrorMessage(result.message);
  };

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  return (
    <section className="grid place-items-center h-100">
      <div className="p-5 mt-5 rounded-lg shadow-md w-100">
        <h4 className="mb-4 text-center text-2xl font-semibold">Registration</h4>

        {processing && <p className="text-center text-green-500">Processing details...</p>}
        {errorMessage && <p className="text-center text-orange-500">{errorMessage}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm ps-1 mb-1">Full Name</label>
            <input
              {...register("name")}
              className="bg-gray-800 w-full border-white p-5"
              placeholder="Name"
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm ps-1 mb-1">Email</label>
            <input
              {...register("email")}
              className="bg-gray-800 w-full border-white p-5"
              placeholder="Your email"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm ps-1 mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              className="bg-gray-800 w-full border-white p-5"
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm ps-1 mb-1">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="bg-gray-800 w-full border-white p-5"
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white py-3 rounded font-semibold cursor-pointer"
          >
            Signup
          </button>
        </form>
      </div>
    </section>
  );
}
