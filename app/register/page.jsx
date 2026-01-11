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
    <div className="min-h-screen w-full bg-[#7B4DFF] flex items-center justify-center px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT SECTION */}
        <div className="text-white flex flex-col justify-center px-4">
          <h2 className="font-semibold text-2xl mb-6">Omniwerse</h2>

          <h1 className="text-4xl font-semibold leading-tight">
            Signup to enjoy the huge ton of{" "}
            <span className="font-bold">exclusive</span> features
          </h1>

          <div className="mt-10 space-y-4">
            <FeatureItem text="Special discounts rates" />
            <FeatureItem text="Unlimited free downloads" />
            <FeatureItem text="Special promotions" />
            <FeatureItem text="Coupon winning" />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <form
          onSubmit={handleSubmit} // Added form submission
          className="bg-white rounded-3xl shadow-xl p-10"
        >
          <h1 className="text-center text-3xl font-semibold">Welcome!</h1>

          {/* Google Btn */}
          <button
            type="button"
            className="w-full border border-gray-300 mt-8 py-3 rounded-md flex items-center justify-center gap-2 text-sm"
          >
            <img src="/google.svg" alt="google" className="w-5 h-5" />
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <span className="grow border-t"></span>
            <span className="text-gray-400 text-sm">OR</span>
            <span className="grow border-t"></span>
          </div>

          {/* Email */}
          <label className="text-sm font-medium text-gray-700">
            Email address*
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email} // bind value
            onChange={(e) => setEmail(e.target.value)} // capture input
            className="mt-1 w-full border border-red-500 rounded-md px-4 py-3 outline-none text-sm"
          />

          {/* Password */}
          <div className="flex justify-between mt-5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <button type="button" className="text-sm text-[#7B4DFF]">
              Forgot password
            </button>
          </div>

          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="••••••••"
              value={password} // bind value
              onChange={(e) => setPassword(e.target.value)} // capture input
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-3 outline-none text-sm"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute top-3.5 right-4 text-gray-500"
            >
              {/* {show ? <EyeOff size={20} /> : <Eye size={20} />} */}
            </button>
          </div>

          {/* Checkbox */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
            />
            <span className="text-sm text-gray-600">Keep me signed in</span>
          </div>

          {/* Button */}
          <button
            type="submit" // make it submit form
            className="w-full mt-8 py-3 bg-[#7B4DFF] text-white font-medium rounded-md text-sm"
          >
            Sign Up
          </button>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already Sign Up?{" "}
            <a href="/login" className="text-[#7B4DFF] font-medium">
              Login
            </a>
          </p>
        </form>

      </div>
    </div>
  );
}
