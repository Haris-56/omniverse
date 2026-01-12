"use client";

import { 
  PieChart, 
  BarChart2, 
  Users, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Mail, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Zap,
  Target
} from "lucide-react";

export default function DashboardPage() {
  const sections = [
    {
      label: "Overview",
      icon: <Activity size={18} />,
      cards: [
        {
          title: "Total Campaigns",
          value: "9",
          trend: "+12.5%",
          trendUp: true,
          icon: <PieChart size={22} />,
          color: "indigo"
        },
        {
          title: "Total Leads",
          value: "723",
          trend: "+5.2%",
          trendUp: true,
          icon: <Target size={22} />,
          color: "rose"
        },
        {
          title: "Avg. Response Rate",
          value: "05%",
          trend: "-1.2%",
          trendUp: false,
          icon: <Users size={22} />,
          color: "amber"
        }
      ]
    },
    {
      label: "Facebook Performance",
      icon: <Facebook size={18} />,
      cards: [
        {
          title: "Accounts",
          value: "02",
          icon: <Facebook size={22} />,
          color: "blue"
        },
        {
          title: "Leads Contacted",
          value: "145",
          trend: "+8.4%",
          trendUp: true,
          icon: <BarChart2 size={22} />,
          color: "blue"
        },
        {
          title: "Response Rate",
          value: "03%",
          icon: <Users size={22} />,
          color: "blue"
        }
      ]
    },
    {
      label: "Instagram Performance",
      icon: <Instagram size={18} />,
      cards: [
        {
          title: "Accounts",
          value: "04",
          icon: <Instagram size={22} />,
          color: "purple"
        },
        {
          title: "Leads Contacted",
          value: "256",
          trend: "+15.2%",
          trendUp: true,
          icon: <BarChart2 size={22} />,
          color: "purple"
        },
        {
          title: "Response Rate",
          value: "02%",
          icon: <Users size={22} />,
          color: "purple"
        }
      ]
    },
    {
      label: "LinkedIn Performance",
      icon: <Linkedin size={18} />,
      cards: [
        {
          title: "Accounts",
          value: "01",
          icon: <Linkedin size={22} />,
          color: "sky"
        },
        {
          title: "Connections Sent",
          value: "78",
          trend: "+2.1%",
          trendUp: true,
          icon: <BarChart2 size={22} />,
          color: "sky"
        },
        {
          title: "Accepted Ratio",
          value: "15%",
          icon: <Users size={22} />,
          color: "sky"
        }
      ]
    },
    {
      label: "Email Performance",
      icon: <Mail size={18} />,
      cards: [
        {
          title: "Accounts",
          value: "02",
          icon: <Mail size={22} />,
          color: "emerald"
        },
        {
          title: "Emails Sent",
          value: "190",
          trend: "+12.5%",
          trendUp: true,
          icon: <BarChart2 size={22} />,
          color: "emerald"
        },
        {
          title: "Reply Rate",
          value: "01%",
          icon: <Users size={22} />,
          color: "emerald"
        }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
      rose: "bg-rose-50 text-rose-600 border-rose-100",
      amber: "bg-amber-50 text-amber-600 border-amber-100",
      blue: "bg-blue-50 text-blue-600 border-blue-100",
      purple: "bg-purple-50 text-purple-600 border-purple-100",
      sky: "bg-sky-50 text-sky-600 border-sky-100",
      emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };
    return colors[color] || colors.indigo;
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome to Omniverse</h1>
          <p className="text-gray-500 mt-1">Here's what's happening across your outreach channels.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-semibold border border-indigo-100">
          <Zap size={16} fill="currentColor" />
          <span>Automation Active</span>
        </div>
      </div>

      {sections.map((section, sIdx) => (
        <div key={sIdx} className="space-y-4">
          <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest px-1">
            {section.icon}
            {section.label}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.cards.map((card, cIdx) => (
              <div
                key={cIdx}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* Decorative Background Blob */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 blur-2xl ${getColorClasses(card.color).split(' ')[0]}`} />
                
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl border ${getColorClasses(card.color)} transition-transform group-hover:scale-110 duration-300`}>
                    {card.icon}
                  </div>
                  {card.trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${card.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {card.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {card.trend}
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{card.value}</h2>
                  </div>
                </div>

                {/* Progress bar simulation for aesthetic */}
                <div className="mt-4 w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getColorClasses(card.color).split(' ')[0].replace('-50', '-500')} opacity-60`} 
                    style={{ width: card.trend ? '70%' : '40%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}