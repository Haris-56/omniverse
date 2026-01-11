"use client";

import { PieChart, BarChart2, Users, Facebook, Instagram, Linkedin, Mail } from "lucide-react";

export default function DashboardPage() {
  const cards = [
    {
      title: "Total Campaigns",
      value: "9",
      inc: "+1.700",
      icon: <PieChart size={22} className="text-teal-600" />,
    },
    {
      title: "Total Leads Contacted",
      value: "723",
      dec: "-1.700",
      icon: <BarChart2 size={22} className="text-green-600" />,
    },
    {
      title: "Response Rate",
      value: "05%",
      icon: <Users size={22} className="text-red-500" />,
      highlight: true,
    },

    {
      title: "Facebook Accounts",
      value: "02",
      inc: "+1.700",
      icon: <Facebook size={22} className="text-gray-700" />,
    },
    {
      title: "Total Leads Contacted",
      value: "145",
      dec: "-1.700",
      icon: <BarChart2 size={22} className="text-green-600" />,
    },
    {
      title: "Response Rate",
      value: "03%",
      icon: <Users size={22} className="text-red-500" />,
      highlight: true,
    },

    {
      title: "Instagram Accounts",
      value: "04",
      inc: "+1.700",
      icon: <Instagram size={22} className="text-gray-700" />,
    },
    {
      title: "Total Leads Contacted",
      value: "256",
      dec: "-1.700",
      icon: <BarChart2 size={22} className="text-green-600" />,
    },
    {
      title: "Response Rate",
      value: "02%",
      icon: <Users size={22} className="text-red-500" />,
      highlight: true,
    },

    {
      title: "LinkedIn Accounts",
      value: "01",
      inc: "+1.700",
      icon: <Linkedin size={22} className="text-gray-700" />,
    },
    {
      title: "Total Connection Sent",
      value: "78",
      dec: "-1.700",
      icon: <BarChart2 size={22} className="text-green-600" />,
    },
    {
      title: "Accepted Ratio",
      value: "15%",
      icon: <Users size={22} className="text-red-500" />,
      highlight: true,
    },

    {
      title: "Email Accounts",
      value: "02",
      inc: "+1.700",
      icon: <Mail size={22} className="text-gray-700" />,
    },
    {
      title: "Total Email Sent",
      value: "190",
      dec: "-1.700",
      icon: <BarChart2 size={22} className="text-green-600" />,
    },
    {
      title: "Reply Rate",
      value: "01%",
      icon: <Users size={22} className="text-red-500" />,
      highlight: true,
    },
  ];

  return (
    <div className=" p-6 min-w-[1000px]">
      {/* <h1 className="text-2xl font-semibold mb-6">Dashboard</h1> */}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between border"
          >
            {/* Left Content */}
            <div>
              <p className="text-gray-600 text-sm">{item.title}</p>
              <h2 className="text-2xl font-semibold mt-1">{item.value}</h2>

              {item.inc && (
                <p className="text-green-500 text-xs mt-1">{item.inc}</p>
              )}

              {item.dec && (
                <p className="text-red-500 text-xs mt-1">{item.dec}</p>
              )}
            </div>

            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                item.highlight
                  ? "bg-red-100 text-red-500"
                  : "bg-teal-50 text-teal-600"
              }`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}