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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* LEFT SIDE - Info Panel */}
      <div className="md:w-[45%] lg:w-[40%] bg-[#6F3FF5] text-white p-8 md:p-12 lg:p-16 flex flex-col justify-center relative flex-shrink-0">
        <div className="max-w-md mx-auto md:mx-0">
          <h2 className="text-2xl font-bold mb-10 tracking-tight">Omniverse</h2>
          <h1 className="text-3xl lg:text-4xl font-semibold leading-tight mb-8">
            Login to enjoy the huge ton of <span className="underline decoration-white/40 decoration-4 underline-offset-8">exclusive</span> features
          </h1>

          <ul className="space-y-6 mt-10">
            <li className="flex items-center gap-4 text-lg font-medium">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✔</span> 
              Special discounts rates
            </li>
            <li className="flex items-center gap-4 text-lg font-medium">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✔</span> 
              Unlimited free downloads
            </li>
            <li className="flex items-center gap-4 text-lg font-medium">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✔</span> 
              Special promotions
            </li>
            <li className="flex items-center gap-4 text-lg font-medium">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✔</span> 
              Coupon winning
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE - Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Please enter your details</p>
          </div>

          <button className="w-full border border-gray-200 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all font-semibold text-gray-700 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <div className="flex items-center my-8">
            <div className="grow h-px bg-gray-100"></div>
            <span className="px-4 text-gray-400 text-sm font-semibold uppercase tracking-wider">OR</span>
            <div className="grow h-px bg-gray-100"></div>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 font-medium">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <button type="button" className="text-sm font-bold text-purple-600 hover:text-purple-700 transition">Forgot password?</button>
              </div>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="keep-signed-in"
                className="w-5 h-5 border-gray-300 rounded-lg text-purple-600 focus:ring-purple-500/20 transition-all cursor-pointer" 
              />
              <label htmlFor="keep-signed-in" className="text-sm text-gray-700 font-medium cursor-pointer">Keep me signed in</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#6F3FF5] text-white font-bold text-base hover:bg-[#5c2cd9] shadow-lg shadow-purple-200 transition-all disabled:opacity-70 active:scale-[0.98] mt-4"
            >
              {loading ? "Signing in..." : "Continue"}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-600 font-medium">
            Don't have an account? <a href="/register" className="text-purple-600 font-bold hover:underline ml-1">Sign up for free</a>
          </p>
        </div>
      </div>
    </div>
  );
}
