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
          <h1 className="text-3xl font-semibold mb-8 text-center text-gray-900">Welcome!</h1>

          <button className="w-full border border-gray-300 py-2 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 text-gray-700">
            <span className="text-lg font-bold">G</span> Sign in with Google
          </button>

          <div className="flex items-center my-6">
            <div className="grow h-px bg-gray-300"></div>
            <span className="px-4 text-gray-600 font-medium">OR</span>
            <div className="grow h-px bg-gray-300"></div>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
                {error}
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-gray-800">Email address*</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold text-gray-800">
                <label>Password</label>
                <button type="button" className="text-purple-600 hover:text-purple-700 transition">Forgot password</button>
              </div>

              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400"
                />
                <span className="absolute right-3 top-3.5 text-gray-600 cursor-pointer">👁</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 border-gray-300 rounded text-purple-600 focus:ring-purple-500" />
              <span className="text-sm text-gray-700 font-medium">Keep me signed in</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#6F3FF5] text-white font-bold text-lg hover:bg-[#5c2cd9] shadow-lg transition disabled:opacity-70 active:scale-[0.98]"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-700">
            Not a member? <a href="/register" className="text-purple-600 font-bold hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
