import React from "react";

export default function page() {
  return (
    <div className="min-h-screen min-w-screen grid grid-cols-1 md:grid-cols-2 bg-white">
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
      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-semibold mb-8 text-center">Welcome!</h1>

          <button className="w-full border border-gray-300 py-2 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50">
            <span className="text-lg">G</span> Sign in with Google
          </button>

          <div className="flex items-center my-6">
            <div className="grow h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500">OR</span>
            <div className="grow h-px bg-gray-300"></div>
          </div>

          <form className="space-y-5">
            <div>
              <label className="text-sm font-medium">Email address*</label>
              <input
                type="email"
                className="w-full mt-1 px-4 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 border border-gray-300"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium">
                <label>Password</label>
                <button type="button" className="text-purple-600">Forgot password</button>
              </div>

              <div className="relative">
                <input
                  type="password"
                  className="w-full mt-1 px-4 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 border border-gray-300"
                />
                <span className="absolute right-3 top-3 text-gray-500 cursor-pointer">👁</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Keep me signed in</span>
            </div>

            <button className="w-full py-3 rounded-xl bg-[#6F3FF5] text-white font-medium text-lg hover:bg-[#5c2cd9] shadow-lg transition">
              LOGIN
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Not a member? <a href="/signup" className="text-purple-600">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
