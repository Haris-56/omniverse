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
  Target,
  Globe,
  Database,
  Cpu,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Hexagon
} from "lucide-react";

export default function DashboardPage() {
  const sections = [
    {
      label: "Your Success Today",
      icon: <Activity size={18} />,
      cards: [
        {
          title: "Total Plans",
          value: "09",
          trend: "+12.5%",
          trendUp: true,
          icon: <PieChart size={24} />,
          color: "copper"
        },
        {
          title: "New Leads Found",
          value: "723",
          trend: "+5.2%",
          trendUp: true,
          icon: <Target size={24} />,
          color: "rose"
        },
        {
          title: "Reply Rate",
          value: "05%",
          trend: "-1.2%",
          trendUp: false,
          icon: <Users size={24} />,
          color: "amber"
        }
      ]
    },
    {
      label: "Facebook Work",
      icon: <Facebook size={18} />,
      cards: [
        {
          title: "Accounts Connected",
          value: "02",
          icon: <Facebook size={24} />,
          color: "blue"
        },
        {
          title: "Messages Sent",
          value: "145",
          trend: "+8.4%",
          trendUp: true,
          icon: <BarChart2 size={24} />,
          color: "blue"
        },
        {
          title: "Reply Chance",
          value: "03%",
          icon: <Users size={24} />,
          color: "blue"
        }
      ]
    },
    {
      label: "Instagram Work",
      icon: <Instagram size={18} />,
      cards: [
        {
          title: "Accounts Connected",
          value: "04",
          icon: <Instagram size={24} />,
          color: "purple"
        },
        {
          title: "Messages Sent",
          value: "256",
          trend: "+15.2%",
          trendUp: true,
          icon: <BarChart2 size={24} />,
          color: "purple"
        },
        {
          title: "Reply Chance",
          value: "02%",
          icon: <Users size={24} />,
          color: "purple"
        }
      ]
    },
    {
      label: "LinkedIn Work",
      icon: <Linkedin size={18} />,
      cards: [
        {
          title: "Accounts Connected",
          value: "01",
          icon: <Linkedin size={24} />,
          color: "sky"
        },
        {
          title: "Invites Sent",
          value: "78",
          trend: "+2.1%",
          trendUp: true,
          icon: <BarChart2 size={24} />,
          color: "sky"
        },
        {
          title: "Acceptance Rate",
          value: "15%",
          icon: <Users size={24} />,
          color: "sky"
        }
      ]
    },
    {
      label: "Email Work",
      icon: <Mail size={18} />,
      cards: [
        {
          title: "Accounts Connected",
          value: "02",
          icon: <Mail size={24} />,
          color: "emerald"
        },
        {
          title: "Emails Sent",
          value: "190",
          trend: "+12.5%",
          trendUp: true,
          icon: <BarChart2 size={24} />,
          color: "emerald"
        },
        {
          title: "Reply Rate",
          value: "01%",
          icon: <Users size={24} />,
          color: "emerald"
        }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      copper: "text-[#8245EF] border-[#8245EF]/20 bg-[#8245EF]/5",
      emerald: "text-[#9EB3A0] border-[#9EB3A0]/20 bg-[#9EB3A0]/5",
      amber: "text-[#C9A66B] border-[#C9A66B]/20 bg-[#C9A66B]/5",
      blue: "text-[#8E9AAF] border-[#8E9AAF]/20 bg-[#8E9AAF]/5",
      rose: "text-[#D4A59A] border-[#D4A59A]/20 bg-[#D4A59A]/5",
      purple: "text-[#9B8AA0] border-[#9B8AA0]/20 bg-[#9B8AA0]/5",
      sky: "text-[#A9C5C8] border-[#A9C5C8]/20 bg-[#A9C5C8]/5",
    };
    return colors[color] || colors.copper;
  };

  const getMeterColor = (color) => {
     const meters = {
        emerald: "bg-[#9EB3A0] shadow-[0_0_10px_rgba(158,179,160,0.3)]",
        rose: "bg-[#D4A59A] shadow-[0_0_10px_rgba(212,165,154,0.3)]",
        blue: "bg-[#8E9AAF] shadow-[0_0_10px_rgba(142,154,175,0.3)]",
        purple: "bg-[#9B8AA0] shadow-[0_0_10px_rgba(155,138,160,0.3)]",
        sky: "bg-[#A9C5C8] shadow-[0_0_10px_rgba(169,197,200,0.3)]",
        amber: "bg-[#C9A66B] shadow-[0_0_10px_rgba(201,166,107,0.3)]",
        copper: "bg-[#8245EF] shadow-[0_0_10px_rgba(130, 69, 239,0.3)]",
     };
     return meters[color] || meters.copper;
  };

  return (
    <div className="w-full space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[#8245EF]/10 pb-12">
        <div className="flex items-center gap-8">
           <div className="w-20 h-20 bg-white border border-[#8245EF]/15 rounded-[2.5rem] flex items-center justify-center shadow-sm">
              <Hexagon size={40} className="text-[#8245EF]" />
           </div>
           <div>
              <h1 className="text-5xl font-black text-[#161932] tracking-tighter uppercase leading-tight">Your <span className="text-[#8245EF]">Overview</span></h1>
              <p className="text-[#64748b] mt-2 text-xl font-medium">See how many messages were sent and who wrote back.</p>
           </div>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 bg-[#8245EF]/10 text-[#8245EF] rounded-2xl text-[10px] font-black border border-[#8245EF]/20 shadow-sm transition-all hover:bg-[#8245EF]/20 font-mono tracking-widest uppercase">
          <Zap size={18} className="animate-pulse" />
          Everything is working fine
        </div>
      </div>

      {/* Grid Content */}
      <div className="space-y-28">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-10">
            <div className="flex items-center gap-6 text-[#94a3b8] font-black text-[11px] uppercase tracking-[0.4em] font-mono px-4">
              <div className="p-2 rounded-xl bg-white border border-[#8245EF]/10 shadow-sm">{section.icon}</div>
              {section.label}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 px-2">
              {section.cards.map((card, cIdx) => (
                <div
                   key={cIdx}
                   className="group bg-white rounded-[4rem] p-12 transition-all duration-700 relative overflow-hidden flex flex-col justify-between border border-[#8245EF]/10 hover:shadow-[0_45px_90px_rgba(130, 69, 239,0.08)] hover:-translate-y-3"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-[#8245EF]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
                  
                  <div className="flex items-start justify-between relative z-10 w-full mb-16">
                    <div className={`w-14 h-14 rounded-2xl border ${getColorClasses(card.color)} transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shadow-sm flex items-center justify-center`}>
                      {card.icon}
                    </div>
                    {card.trend && (
                      <div className={`flex items-center gap-2 text-[10px] font-black px-4 py-2 rounded-xl border font-mono tracking-widest ${card.trendUp ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                        {card.trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {card.trend}
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 w-full">
                    <p className="text-[#94a3b8] text-[11px] font-black uppercase tracking-[0.3em] font-mono mb-3">{card.title}</p>
                    <h2 className="text-6xl font-black text-[#161932] tracking-tighter uppercase font-sans leading-none">{card.value}</h2>
                    
                    {/* Visual Meter */}
                    <div className="mt-12 overflow-hidden relative">
                       <div className="w-full h-2 bg-[#FCF8FE] rounded-full overflow-hidden shadow-inner">
                          <div 
                             className={`h-full rounded-full transition-all duration-1000 delay-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${getMeterColor(card.color)}`} 
                             style={{ width: card.trend ? '85%' : '45%' }}
                          />
                       </div>
                    </div>
                  </div>

                  {/* Card Background Pattern */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-[#8245EF]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 opacity-[0.015] pointer-events-none group-hover:opacity-[0.03] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

       {/* Texture Background Watermark */}
       <div className="fixed bottom-10 right-10 pointer-events-none opacity-[0.03] select-none z-[-1] grayscale">
         <div className="flex flex-col items-end gap-6">
            <h1 className="text-[12rem] font-black font-sans tracking-tight uppercase leading-none text-[#8245EF]">HI</h1>
            <div className="flex items-center gap-6">
               <Hexagon size={60} strokeWidth={2} className="text-[#8245EF]" />
               <p className="text-3xl font-black uppercase tracking-[1em] text-[#8245EF] font-mono">HELLO</p>
            </div>
         </div>
      </div>
    </div>
  );
}