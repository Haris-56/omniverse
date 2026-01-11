"use client";
import React, { useState } from "react";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await authClient.signIn.email({
      email,
      password,
    }, {
      onSuccess: () => {
        router.push("/");
      },
      onError: (ctx) => {
        setError(ctx.error.message || "Something went wrong");
        setLoading(false);
      },
    });
  };

  return (
    <div className="h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-white overflow-hidden">
      {/* LEFT SIDE */}
      <div className="bg-[#6F3FF5] text-white flex flex-col justify-center px-12 py-16 relative">
        <h2 className="text-xl font-medium mb-6">Company<span className="font-bold">Name</span></h2>
        <h1 className="text-4xl font-light leading-snug mb-6">
          Login to enjoy <br /> the huge ton of <br /> <span className="font-bold">exclusive</span> features
        </h1>

        <ul className="space-y-4 mt-4 text-lg">
          <li className="flex items-center gap-3"><span>✔</span> Special discounts rates</li>
          <li className="flex items-center gap-3"><span>✔</span> Unlimited free downloads</li>
          <li className="flex items-center gap-3"><span>✔</span> Special promotions</li>
          <li className="flex items-center gap-3"><span>✔</span> Coupon winning</li>
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-center text-black">Welcome!</h1>

          <button className="w-full border-2 border-gray-300 py-2 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 text-black font-semibold">
            <span className="text-lg font-bold">G</span> Sign in with Google
          </button>

          <div className="flex items-center my-6">
            <div className="grow h-px bg-gray-400"></div>
            <span className="px-4 text-black font-bold">OR</span>
            <div className="grow h-px bg-gray-400"></div>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center border-2 border-red-300 font-bold">
                {error}
              </div>
            )}
            <div>
              <label className="text-sm font-bold text-black uppercase tracking-wide">Email address*</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 px-4 py-3 bg-white border-2 border-gray-400 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 text-black font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-black uppercase tracking-wide">
                <label>Password</label>
                <button type="button" className="text-purple-700 hover:text-purple-900 transition underline">Forgot password</button>
              </div>

              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-3 bg-white border-2 border-gray-400 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 text-black font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 border-2 border-gray-400 rounded text-purple-600 focus:ring-purple-500" />
              <span className="text-sm text-black font-bold">Keep me signed in</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#6F3FF5] text-white font-black text-xl hover:bg-[#5c2cd9] shadow-2xl transition disabled:opacity-70 active:scale-[0.98]"
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </form>

          <p className="mt-8 text-center text-base text-black font-medium">
            Not a member? <a href="/register" className="text-purple-700 font-black hover:underline ml-1">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
