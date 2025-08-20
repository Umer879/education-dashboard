"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api"; // axios instance withCredentials: true

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Backend login API call
      await api.post("/admin/login", { email, password });

      // Cookie automatically set ho gayi hai
      router.push("/teachers"); // redirect dashboard
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1E40AF]">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1E40AF]">
          Admin Login
        </h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-[#1E40AF] text-white py-3 rounded hover:bg-[#1e40afd0]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
