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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

   await authClient.signUp.email({
    email: email,
    password: password,
    name: name,
    image: "https://example.com/image.png",
    callbackURL: "/dashboard",
   }, {
        onRequest: (ctx) => {
            // show loading maybe
        },
        onSuccess: (ctx) => {
            router.push('/')
        },
        onError: (ctx) => {
            console.error("SIGNUP_ERROR:", ctx.error);
            alert(ctx.error?.message || "An unknown error occurred during signup");
        },
      });
      console.log("Signup Response Data:", data)
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* LEFT SECTION - Info Panel */}
      <div className="md:w-[45%] lg:w-[40%] bg-[#6F3FF5] text-white p-8 md:p-12 lg:p-16 flex flex-col justify-center relative flex-shrink-0">
        <div className="max-w-md mx-auto md:mx-0">
          <h2 className="text-2xl font-bold mb-10 tracking-tight">Omniverse</h2>
          <h1 className="text-3xl lg:text-4xl font-semibold leading-tight mb-8">
            Signup to enjoy the huge ton of <span className="underline decoration-white/40 decoration-4 underline-offset-8">exclusive</span> features
          </h1>

          <div className="space-y-6 mt-10">
            <FeatureItem text="Special discounts rates" />
            <FeatureItem text="Unlimited free downloads" />
            <FeatureItem text="Special promotions" />
            <FeatureItem text="Coupon winning" />
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join Omniverse today</p>
          </div>

          {/* Google Btn */}
          <button
            type="button"
            className="w-full border border-gray-200 py-3 rounded-xl flex items-center justify-center gap-3 transition-all font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="grow h-px bg-gray-100"></div>
            <span className="px-4 text-gray-400 text-sm font-semibold uppercase tracking-wider">OR</span>
            <div className="grow h-px bg-gray-100"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <button type="button" onClick={() => setShow(!show)} className="text-xs font-bold text-purple-600 hover:underline">
                  {show ? "Hide" : "Show"}
                </button>
              </div>

              <input
                type={show ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="keep-signed-in"
                className="w-5 h-5 border-gray-300 rounded-lg text-[#6F3FF5] focus:ring-purple-500/20 transition-all cursor-pointer"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
              />
              <label htmlFor="keep-signed-in" className="text-sm text-gray-700 font-medium cursor-pointer">Keep me signed in</label>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-4 bg-[#6F3FF5] text-white font-bold rounded-xl text-base shadow-lg shadow-purple-200 hover:bg-[#5c2cd9] transition-all active:scale-[0.98] mt-4"
            >
              Get Started
            </button>

            {/* Login */}
            <p className="mt-10 text-center text-gray-600 font-medium">
              Already have an account?{" "}
              <a href="/login" className="text-purple-600 font-bold hover:underline ml-1">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
