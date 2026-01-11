"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

   await authClient.signUp.email({
    email: email,
    password: password,
    image: "https://example.com/image.png",
    callbackURL: "/dashboard",
   }, {
        onRequest: (ctx) => {
            // show loading maybe
        },
        onSuccess: (ctx) => {
            router.push('/dashboard')
        },
        onError: (ctx) => {
            alert(ctx.error?.message || "An unknown error occurred during signup");
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
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col justify-center overflow-y-auto border-2 border-gray-100">
          <form
            onSubmit={handleSubmit}
            className="w-full"
          >
            <h1 className="text-center text-3xl font-black text-black">Welcome!</h1>

            {/* Google Btn */}
            <button
              type="button"
              className="w-full border-2 border-gray-300 mt-8 py-3 rounded-xl flex items-center justify-center gap-3 text-sm font-bold text-black hover:bg-gray-50 transition"
            >
              <img src="/google.svg" alt="google" className="w-5 h-5" />
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <span className="grow border-t-2 border-gray-200"></span>
              <span className="text-black text-xs font-black uppercase tracking-widest">OR</span>
              <span className="grow border-t-2 border-gray-200"></span>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-black text-black uppercase tracking-wider">
                Email address*
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-2 border-gray-400 rounded-xl px-4 py-3 outline-none text-sm text-black font-medium focus:ring-2 focus:ring-[#7B4DFF] placeholder-gray-500"
              />
            </div>

            {/* Password */}
            <div className="mt-5 space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-black uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs font-black text-[#7B4DFF] hover:underline uppercase tracking-tight">
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
                  className="w-full border-2 border-gray-400 rounded-xl px-4 py-3 outline-none text-sm text-black font-medium focus:ring-2 focus:ring-[#7B4DFF] placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute top-3 right-4 h-full text-black font-bold uppercase text-[10px]"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="mt-6 flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 border-2 border-gray-400 rounded text-[#7B4DFF] focus:ring-[#7B4DFF]"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
              />
              <span className="text-sm text-black font-bold">Keep me signed in</span>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full mt-8 py-4 bg-[#6F3FF5] text-white font-black rounded-xl text-lg shadow-2xl hover:bg-[#5c2cd9] transition active:scale-[0.98] uppercase"
            >
              Sign Up
            </button>

            {/* Login */}
            <p className="mt-8 text-center text-sm text-black font-medium">
              Already have an account?{" "}
              <a href="/login" className="text-purple-700 font-extrabold hover:underline ml-1">
                Login
              </a>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}
