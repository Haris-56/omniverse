"use client";
import { Search, Grid, List } from "lucide-react";

export default function Template() {
  return (
    <div className="w-full p-6">

      {/* Top bar */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm">
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <Grid size={20} />
        </button>

        <div className="relative w-72">
          <input
            placeholder="Search Order"
            className="w-full border rounded-lg py-2 px-10 text-sm bg-gray-50 outline-none"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
        </div>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold mt-8">FACEBOOK</h1>

      {/* Layout icon */}
      <div className="flex items-center gap-3 mt-4">
        <button className="p-2 bg-gray-100 rounded-md">
          <Grid size={18} />
        </button>

        <button className="p-2 bg-gray-100 rounded-md">
          <List size={18} />
        </button>
      </div>

      {/* Main Form Container */}
      <div className="bg-white shadow-sm rounded-xl p-8 mt-6 w-full max-w-4xl">

        {/* Campaign Name */}
        <div className="mb-4">
          <label className="text-gray-700 text-sm font-medium">Campaign name</label>
          <input
            type="text"
            placeholder="Your Product Name"
            className="w-full border rounded-lg px-4 py-2 mt-1 text-sm bg-gray-50 outline-none"
          />
        </div>

        {/* Message Template */}
        <div className="mb-4">
          <label className="text-gray-700 text-sm font-medium">Message Template</label>
        </div>

        {/* Template Name Buttons */}
        <div className="flex items-center gap-3 mb-4">
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm">
            Normal Price
          </button>
          <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm">
            Sale Price
          </button>
        </div>

        {/* Text Editor Placeholder */}
        <div className="border rounded-lg">
          {/* Editor Header */}
          <div className="border-b p-2 flex items-center gap-2">
            <select className="border px-2 py-1 rounded text-sm">
              <option>Paragraph</option>
            </select>

            <button className="px-2 py-1 text-sm font-bold">B</button>
            <button className="px-2 py-1 text-sm italic">I</button>
            <button className="px-2 py-1 text-sm underline">U</button>

            <button className="px-2 py-1 text-sm">• List</button>
            <button className="px-2 py-1 text-sm">1. List</button>

            <button className="px-2 py-1 text-sm">Image</button>
            <button className="px-2 py-1 text-sm">Code</button>
          </div>

          {/* Editor Body */}
          <textarea
            className="w-full h-40 p-3 text-sm outline-none resize-none"
            placeholder="Write your message..."
          />
        </div>

        {/* Type */}
        <div className="mt-5">
          <label className="text-gray-700 text-sm font-medium">Type :</label>
          <input
            type="text"
            placeholder="Info Type"
            className="w-full border rounded-lg px-4 py-2 mt-1 text-sm bg-gray-50 outline-none"
          />
        </div>

        {/* Style */}
        <div className="mt-5">
          <label className="text-gray-700 text-sm font-medium">Style :</label>
          <input
            type="text"
            placeholder="Info Style"
            className="w-full border rounded-lg px-4 py-2 mt-1 text-sm bg-gray-50 outline-none"
          />
        </div>

        {/* Product Number */}
        <div className="mt-5">
          <label className="text-gray-700 text-sm font-medium">Product Number :</label>
          <input
            type="text"
            placeholder="Info Product Number"
            className="w-full border rounded-lg px-4 py-2 mt-1 text-sm bg-gray-50 outline-none"
          />
        </div>

      </div>
    </div>
  );
}
