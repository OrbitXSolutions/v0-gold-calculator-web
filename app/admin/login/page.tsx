"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { loginWithPassword } from "../../../lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<"token" | "password">("password");
  const [token, setToken] = React.useState("");
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function submitToken(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) { setError("Token required"); return; }
    localStorage.setItem("auth_token", token.trim());
    router.replace("/admin/blogs");
  }

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim() || !password) { setError("Email/username and password are required"); return; }
    setLoading(true); setError(null);
    try {
      const res = await loginWithPassword(identifier.trim(), password);
      localStorage.setItem("auth_token", res.accessToken);
      localStorage.setItem("auth_user", JSON.stringify({
        userId: res.userId,
        userName: res.userName,
        displayName: res.displayName,
        expiresUtc: res.expiresUtc,
      }));
      router.replace("/admin/blogs");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-sm mx-auto mt-24 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
      <div className="flex gap-2 mb-4 text-sm">
        <button onClick={() => setMode("password")} className={`px-3 py-1 rounded ${mode==='password' ? 'bg-yellow-500 text-white' : 'bg-gray-100'}`}>Email/Password</button>
        <button onClick={() => setMode("token")} className={`px-3 py-1 rounded ${mode==='token' ? 'bg-yellow-500 text-white' : 'bg-gray-100'}`}>Paste Token</button>
      </div>

      {mode === "password" ? (
        <form onSubmit={submitPassword} className="flex flex-col gap-3">
          <input value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="Email or Username" name="userNameOrEmail" className="rounded border px-3 py-2 text-sm" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" className="rounded border px-3 py-2 text-sm" />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button disabled={loading} type="submit" className="rounded bg-yellow-500 hover:bg-yellow-600 disabled:opacity-40 text-white text-sm font-medium px-4 py-2">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
      ) : (
        <form onSubmit={submitToken} className="flex flex-col gap-3">
          <textarea value={token} onChange={e => setToken(e.target.value)} rows={4} placeholder="Paste JWT token" className="rounded border px-3 py-2 text-sm font-mono" />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="submit" className="rounded bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium px-4 py-2">Login</button>
        </form>
      )}
    </div>
  );
}
