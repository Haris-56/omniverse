import { Globe, Zap, ShieldCheck, Database, Key, Terminal, Share2, Mail, ExternalLink, Hexagon } from "lucide-react";

export default function ExternalAPIsPage() {
  const apis = [
    {
      name: "Facebook Graph v18.0",
      purpose: "Identity integration and automated engagement protocols.",
      endpoints: ["/me/accounts", "/{page-id}/feed"],
      auth: "OAuth 2.0 User Access Tokens",
      status: "Stable"
    },
    {
      name: "Instagram Basic Display",
      purpose: "Visual media orchestration and content synchronization.",
      endpoints: ["/me/media", "/me"],
      auth: "IG User Access Tokens",
      status: "Operational"
    },
    {
      name: "LinkedIn API v2",
      purpose: "B2B professional outreach and profile connectivity.",
      endpoints: ["/v2/me", "/v2/ugcPosts"],
      auth: "OAuth 2.0 Client Credentials",
      status: "Active"
    },
    {
      name: "SMTP Secure Gateway",
      purpose: "High-volume transactional and cold outreach distribution.",
      endpoints: ["SMTP RELAY:587", "SSL/TLS:465"],
      auth: "CRAM-MD5 / PLAIN AUTH",
      status: "Secured"
    }
  ];

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-40 font-sans">
      <div className="border-b border-[#8245EF]/10 pb-16 relative">
        <div className="flex items-center gap-3 mb-6">
           <span className="px-5 py-2 bg-[#8245EF]/10 text-[#8245EF] text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-[#8245EF]/20 flex items-center gap-3 font-mono">
             <Hexagon size={16} className="opacity-80" />
             Connectivity::Gateway
           </span>
        </div>
        <h1 className="text-7xl font-black text-[#161932] tracking-tighter uppercase leading-none">
          External <span className="text-[#8245EF]">APIs</span>
        </h1>
        <p className="text-[#64748b] mt-8 text-2xl leading-relaxed max-w-3xl font-medium italic">Integration architecture for cross-platform orchestration and identity synchronization.</p>
      </div>

      <section className="space-y-12">
        <div className="flex items-center gap-4 px-8 py-3 bg-[#8245EF]/5 border border-[#8245EF]/10 rounded-full w-fit">
           <Share2 size={18} className="text-[#8245EF]" />
           <span className="text-[10px] font-black text-[#8245EF] uppercase tracking-[0.4em] font-mono">5.2.1 Integration Matrix</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {apis.map((api, idx) => (
             <div key={idx} className="group floating-glass rounded-[4rem] p-12 flex flex-col justify-between relative overflow-hidden transition-all duration-700 border-[#8245EF]/10">
                <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 rounded-full bg-[#8245EF]"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-3xl font-black text-[#161932] tracking-tighter uppercase">{api.name}</h3>
                     <span className="px-5 py-2 bg-[#8245EF]/10 text-[#8245EF] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#8245EF]/20 font-mono">
                        {api.status}
                     </span>
                  </div>
                  <p className="text-[#64748b] text-xl leading-relaxed mb-12 font-bold italic group-hover:text-[#161932] transition-colors">
                    "{api.purpose}"
                  </p>
                  
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] font-mono">Auth_Protocol</span>
                        <div className="flex items-center gap-4 text-[#161932] font-bold text-sm bg-white border border-[#8245EF]/10 px-5 py-3 rounded-2xl w-fit shadow-sm">
                           <Key size={16} className="text-[#8245EF]" />
                           {api.auth}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] font-mono">Targeted_Endpoints</span>
                        <div className="flex flex-wrap gap-3">
                           {api.endpoints.map(ep => (
                             <span key={ep} className="text-[10px] font-black font-mono text-[#8245EF] bg-white border border-[#8245EF]/10 px-4 py-2 rounded-xl group-hover:border-[#8245EF]/30 transition-all shadow-sm">
                               {ep}
                             </span>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>

                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             </div>
           ))}
        </div>
      </section>

      <section className="space-y-12">
        <div className="flex items-center gap-4 px-8 py-3 bg-[#8245EF]/5 border border-[#8245EF]/10 rounded-full w-fit">
           <Terminal size={18} className="text-[#8245EF]" />
           <span className="text-[10px] font-black text-[#8245EF] uppercase tracking-[0.4em] font-mono">5.2.2 Secure Header Construction (Example)</span>
        </div>

        <div className="bg-white rounded-[4rem] border border-[#8245EF]/15 p-16 shadow-lg relative overflow-hidden group">
           <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#8245EF]/40 to-transparent" />
           <pre className="text-[#161932] font-mono text-base leading-9 relative z-10 overflow-x-auto selection:bg-[#8245EF]/20">
{`// Secure multi-channel API delivery pattern
const response = await fetch("https://graph.facebook.com/v18.0/me", {
  method: "GET",
  headers: {
    "Authorization": \`Bearer \${SECURE_VAULT.RETRIVE_TOKEN("FB_AUTH")}\`,
    "X-Neural-Signature": CRYPTO_MODULE.IDENTIFY(SESSION_ID),
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});`}
           </pre>
        </div>
      </section>
    </div>
  );
}
