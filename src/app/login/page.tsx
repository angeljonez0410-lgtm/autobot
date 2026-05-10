"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push("/");
    setLoading(false);
  }

  async function handleProvider(provider: "google" | "facebook" | "apple") {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4 text-center text-pink-500">Login</h1>
      <form className="grid gap-4" onSubmit={handleLogin}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="bg-gradient-to-r from-pink-300 to-purple-300 text-black font-bold mt-2" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <div className="my-4 text-center text-xs text-gray-400">or</div>
      <div className="grid gap-2">
        <Button onClick={() => handleProvider("google")}
          className="bg-white border text-black font-bold flex items-center justify-center gap-2">
          <span>Continue with Google</span>
        </Button>
        <Button onClick={() => handleProvider("facebook")}
          className="bg-[#4267B2] text-white font-bold flex items-center justify-center gap-2">
          <span>Continue with Facebook</span>
        </Button>
        <Button onClick={() => handleProvider("apple")}
          className="bg-black text-white font-bold flex items-center justify-center gap-2">
          <span>Continue with Apple</span>
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        <a href="/login/sign-up" className="text-pink-500 hover:underline">Sign up</a>
      </div>
      {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
    </div>
  );
}