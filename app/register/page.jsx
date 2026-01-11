"use client";
import { useState } from "react";
import { redirect } from "next/navigation";
import { authClient } from "../../lib/auth-client";
// import { Eye, EyeOff } from "lucide-react";

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-3 text-lg">
      <span>✔</span> {text}
    </div>
  );
}

export default function Register() {
  const [show, setShow] = useState(false);

  // New states to capture form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

   const { data, error } = await authClient.signUp.email({
    email: email, // required
    password: password, // required
    image: "https://example.com/image.png",
    callbackURL: "/dashboard",
},{
        onRequest: (ctx) => {
            //show loading
        },
        onSuccess: (ctx) => {
            redirect('/dashboard')
        },
        onError: (ctx) => {
            alert(ctx.error.message);
        },
      });
      console.log("data" , data)
  };

  return (
    <div className="h-screen w-full bg-[#7B4DFF] flex items-center justify-center px-4 overflow-hidden">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 h-auto md:h-[90vh]">

        {/* LEFT SECTION */}
        <div className="text-white flex flex-col justify-center px-4 overflow-y-auto">
          <h2 className="font-bold text-2xl mb-6 tracking-tight">Omniwerse</h2>

          <h1 className="text-4xl font-semibold leading-tight mb-8">
            Signup to enjoy the huge ton of{" "}
            <span className="font-bold border-b-4 border-white/30">exclusive</span> features
          </h1>

          <div className="space-y-5">
            <FeatureItem text="Special discounts rates" />
            <FeatureItem text="Unlimited free downloads" />
            <FeatureItem text="Special promotions" />
            <FeatureItem text="Coupon winning" />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="w-full"
          >
            <h1 className="text-center text-3xl font-bold text-gray-900">Welcome!</h1>

            {/* Google Btn */}
            <button
              type="button"
              className="w-full border border-gray-300 mt-8 py-3 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <img src="/google.svg" alt="google" className="w-5 h-5" />
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <span className="grow border-t border-gray-200"></span>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">OR</span>
              <span className="grow border-t border-gray-200"></span>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-800">
                Email address*
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none text-sm text-gray-900 focus:ring-2 focus:ring-[#7B4DFF] placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div className="mt-5 space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-800">Password</label>
                <button type="button" className="text-xs font-bold text-[#7B4DFF] hover:underline">
                  Forgot password
                </button>
              </div>

              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none text-sm text-gray-900 focus:ring-2 focus:ring-[#7B4DFF] placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute top-3.5 right-4 text-gray-600 font-medium"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="mt-5 flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 border-gray-300 rounded text-[#7B4DFF] focus:ring-[#7B4DFF]"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
              />
              <span className="text-sm text-gray-800 font-medium">Keep me signed in</span>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full mt-8 py-4 bg-[#7B4DFF] text-white font-bold rounded-xl text-base shadow-lg hover:bg-[#6a3ee5] transition active:scale-[0.98]"
            >
              Sign Up
            </button>

            {/* Login */}
            <p className="mt-6 text-center text-sm text-gray-700 font-medium">
              Already have an account?{" "}
              <a href="/login" className="text-[#7B4DFF] font-bold hover:underline">
                Login
              </a>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}
