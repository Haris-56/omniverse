"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Facebook, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  ShieldCheck, 
  Key, 
  User, 
  Terminal,
  Info,
  Rocket,
  Lock,
  Smartphone,
  Activity,
  Hexagon
} from "lucide-react";

export default function ConnectAccountModal({ isOpen, onClose, onAccountConnected, initialEmail = "" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookies] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  
  // Proxy State
  const [useProxy, setUseProxy] = useState(false);
  const [proxyHost, setProxyHost] = useState("");
  const [proxyPort, setProxyPort] = useState("");
  const [proxyUsername, setProxyUsername] = useState("");
  const [proxyPassword, setProxyPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
        setEmail(initialEmail || "");
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  const handleConnect = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    setLoading(true);
    setError("");
    
    if (result?.status !== "Checkpoint" && result?.status !== "AppConfirmation") {
        setResult(null);
    }

    try {
      const res = await fetch("/api/facebook/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          cookies,
          twoFactorCode,
          proxy: useProxy ? {
            host: proxyHost,
            port: proxyPort,
            username: proxyUsername,
            password: proxyPassword
          } : null
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.status === "Checkpoint" || data.status === "AppConfirmation") {
           setResult({ status: data.status, reason: data.failureReason });
           return;
        }
        throw new Error(data.error || "Failed to connect");
      }

      setResult({ status: data.status, reason: data.failureReason });
      
      if (data.status === "Connected") {
        setTimeout(() => {
          onAccountConnected();
          handleClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setCookies("");
    setTwoFactorCode("");
    setError("");
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 lg:p-20 animate-in fade-in duration-700 overflow-y-auto custom-scrollbar">
      <div className="fixed inset-0 bg-[#161932]/20 backdrop-blur-[60px]" onClick={handleClose} />
      
      <div className="bg-[#FCF8FE] rounded-[4rem] shadow-[0_80px_160px_rgba(130, 69, 239,0.2)] w-full max-w-[1400px] overflow-hidden border border-[#8245EF]/20 relative z-10 animate-in zoom-in-95 duration-1000 my-auto group/modal">
        
        {/* Modal Header */}
        <div className="p-10 border-b border-[#8245EF]/10 flex justify-between items-center bg-white/40">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-white text-[#8245EF] rounded-[2rem] flex items-center justify-center shadow-lg border border-[#8245EF]/10 group-hover/modal:rotate-12 transition-transform duration-700">
                <Facebook size={36} fill="currentColor" />
             </div>
             <div>
                <h2 className="text-3xl font-black text-[#161932] tracking-tighter uppercase">Facebook</h2>
                <p className="text-[10px] font-black text-[#8245EF] uppercase tracking-[0.4em] mt-2 font-mono leading-none">Manage your social accounts here.</p>
             </div>
          </div>
          <button onClick={handleClose} className="p-4 bg-white hover:bg-[#8245EF] group/close rounded-2xl transition-all border border-[#8245EF]/10 text-[#94a3b8] hover:text-white shadow-sm active:scale-90">
            <X size={28} className="group-hover/close:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <div className="p-12 custom-scrollbar max-h-[70vh] overflow-y-auto">
          {result && result.status !== "Checkpoint" && result.status !== "AppConfirmation" ? (
            <div className="text-center py-20 animate-in slide-in-from-bottom duration-500">
              {result.status === "Connected" ? (
                <>
                  <div className="w-32 h-32 bg-white text-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-xl border border-emerald-500/10 transition-transform duration-1000 hover:scale-110">
                    <CheckCircle size={56} />
                  </div>
                  <h3 className="text-4xl font-black text-[#161932] mb-4 tracking-tighter uppercase">Node_Activated</h3>
                  <p className="text-[#64748b] font-black italic text-lg uppercase tracking-widest font-mono text-[12px]">Your Facebook identity is now synchronized with terminal.</p>
                </>
              ) : (
                <>
                  <div className="w-32 h-32 bg-rose-50 text-rose-500 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-inner border border-rose-500/20">
                    <AlertCircle size={56} />
                  </div>
                  <h3 className="text-4xl font-black text-[#161932] mb-4 tracking-tighter uppercase">Signal_Loss</h3>
                  <p className="text-rose-500 font-black mb-12 text-md italic uppercase tracking-widest font-mono">{result.reason}</p>
                  <button 
                    onClick={() => setResult(null)}
                    className="px-16 py-7 bg-[#8245EF] text-white font-black rounded-3xl hover:bg-[#6d28d9] transition-all shadow-2xl text-[12px] uppercase tracking-[0.5em] font-mono border border-white/10 active:scale-95"
                  >
                    Retry_Handshake
                  </button>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-12">
              {error && (
                <div className="p-8 bg-rose-50 border border-rose-500/10 text-rose-600 text-[10px] font-black rounded-[2rem] flex items-center gap-6 animate-pulse uppercase tracking-[0.3em] font-mono shadow-inner italic">
                  <AlertCircle size={28} />
                  {error}
                </div>
              )}

              {(result?.status === "Checkpoint") ? (
                <div className="space-y-12 animate-in slide-in-from-top-4 duration-500">
                   <div className="p-10 bg-white border border-[#8245EF]/10 rounded-[3rem] flex gap-8 items-center shadow-sm">
                      <div className="p-6 bg-[#FCF8FE] rounded-3xl text-[#8245EF] border border-[#8245EF]/10 shadow-inner">
                         <Lock size={32} />
                      </div>
                      <div>
                         <p className="text-2xl font-black text-[#161932] uppercase tracking-tighter leading-none">Verification_Matrix</p>
                         <p className="text-[10px] font-black text-[#94a3b8] mt-3 uppercase tracking-[0.4em] font-mono italic">Security code required to verify sequence protocol.</p>
                      </div>
                   </div>

                   <div className="space-y-4 text-center">
                    <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.5em] font-mono italic">Quantum_Passcode</label>
                    <input
                      type="text"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      className="w-full bg-white border-2 border-transparent border-b-[#8245EF]/20 rounded-3xl px-12 py-8 text-center text-5xl font-black tracking-[1em] text-[#161932] outline-none focus:border-b-[#8245EF] transition-all font-mono shadow-inner italic focus:bg-[#FCF8FE]/50"
                      placeholder="000000"
                    />
                  </div>
                </div>
              ) : result?.status === "AppConfirmation" ? (
                <div className="space-y-12 animate-in slide-in-from-top-4 duration-500">
                   <div className="p-10 bg-white border border-[#8245EF]/10 rounded-[3rem] flex gap-8 items-center shadow-sm">
                      <div className="p-6 bg-[#FCF8FE] rounded-3xl text-[#8245EF] border border-[#8245EF]/10 shadow-inner">
                         <Smartphone size={32} />
                      </div>
                      <div>
                         <p className="text-2xl font-black text-[#161932] uppercase tracking-tighter leading-none">App_Confirmation</p>
                         <p className="text-[10px] font-black text-[#94a3b8] mt-3 uppercase tracking-[0.4em] font-mono italic">Open Meta Authority and approve this terminal link.</p>
                      </div>
                   </div>
                   
                   <div className="py-10 text-center relative">
                      <div className="inline-block px-12 py-6 bg-white text-[#8245EF] text-[11px] font-black uppercase tracking-[0.6em] rounded-full border border-[#8245EF]/15 animate-pulse font-mono shadow-md italic">
                         WAITING_FOR_OPERATOR_AUTHORIZATION...
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-10">
                         <Activity size={240} className="text-[#8245EF] animate-spin-slow" />
                      </div>
                   </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] ml-2 font-mono">Your account name</label>
                      <div className="relative group/input">
                         <User size={24} className="absolute left-8 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within/input:text-[#8245EF] transition-colors" />
                         <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border-2 border-[#FCF8FE] border-b-[#8245EF]/10 rounded-[2rem] pl-20 pr-10 py-6 text-base font-bold text-[#161932] outline-none focus:border-b-[#8245EF] focus:bg-[#FCF8FE]/30 transition-all shadow-inner placeholder:text-[#94a3b8]/40"
                          placeholder="Your username"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] ml-2 font-mono">Your account password</label>
                      <div className="relative group/input">
                         <Key size={24} className="absolute left-8 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within/input:text-[#8245EF] transition-colors" />
                         <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white border-2 border-[#FCF8FE] border-b-[#8245EF]/10 rounded-[2rem] pl-20 pr-10 py-6 text-base font-bold text-[#161932] outline-none focus:border-b-[#8245EF] focus:bg-[#FCF8FE]/30 transition-all shadow-inner placeholder:text-[#94a3b8]/40"
                          placeholder="••••••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] ml-2 font-mono italic">Cookie_Sequence_JSON</label>
                    <textarea
                      value={cookies}
                      onChange={(e) => setCookies(e.target.value)}
                      className="w-full bg-white border-2 border-[#FCF8FE] border-b-[#8245EF]/10 rounded-[2.5rem] px-10 py-8 text-xs font-mono text-[#64748b] outline-none h-40 focus:border-b-[#8245EF] focus:bg-[#FCF8FE]/30 transition-all shadow-inner resize-none custom-scrollbar italic"
                      placeholder='Inject session binary here...'
                    />
                  </div>
                  
                   {/* Proxy Matrix */}
                   <div className="pt-10 border-t border-[#8245EF]/10 space-y-10">
                    <div className="flex items-center gap-6 group cursor-pointer" onClick={() => setUseProxy(!useProxy)}>
                       <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${useProxy ? 'bg-[#8245EF] border-[#8245EF] shadow-[0_0_15px_rgba(130, 69, 239,0.4)]' : 'border-[#8245EF]/20 bg-white hover:border-[#8245EF]'}`}>
                          {useProxy && <CheckCircle size={18} className="text-white" />}
                       </div>
                       <span className="text-[11px] font-black text-[#64748b] uppercase tracking-[0.4em] font-mono group-hover:text-[#8245EF] transition-colors italic">
                          Enable_Proxy_Tunneling
                       </span>
                    </div>

                    {useProxy && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-top-4 duration-500">
                          <div className="space-y-3">
                             <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.4em] font-mono ml-4 italic">Relay_IP_Host</label>
                             <input
                                type="text"
                                value={proxyHost}
                                onChange={(e) => setProxyHost(e.target.value)}
                                className="w-full bg-white border border-[#8245EF]/15 rounded-2xl px-8 py-5 text-sm font-black text-[#161932] outline-none focus:border-[#8245EF] shadow-inner font-mono italic"
                                placeholder="00.00.00.00"
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.4em] font-mono ml-4 italic">Tunnel_Port</label>
                             <input
                                type="text"
                                value={proxyPort}
                                onChange={(e) => setProxyPort(e.target.value)}
                                className="w-full bg-white border border-[#8245EF]/15 rounded-2xl px-8 py-5 text-sm font-black text-[#161932] outline-none focus:border-[#8245EF] shadow-inner font-mono italic"
                                placeholder="8080"
                             />
                          </div>
                       </div>
                    )}
                   </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8245EF] text-white py-8 rounded-[2.5rem] font-black text-xl shadow-[0_30px_60px_rgba(130, 69, 239,0.3)] hover:bg-[#6d28d9] transition-all disabled:opacity-50 flex items-center justify-center gap-6 active:scale-[0.98] border border-white/10 mt-10 uppercase tracking-[0.6em] font-mono text-[12px] group/btn"
              >
                {loading ? (
                  <>
                    <Loader2 size={32} className="animate-spin opacity-80" />
                    <span className="animate-pulse">Handshake_Inception...</span>
                  </>
                ) : (
                  <>
                    <span>{result?.status === "Checkpoint" ? "Submit" : result?.status === "AppConfirmation" ? "Confirm" : "Connect Account"}</span>
                    <Rocket size={32} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
        
        {/* Footer info */}
        <div className="p-10 bg-[#FCF8FE]/60 border-t border-[#8245EF]/10 flex items-center justify-center gap-6 relative overflow-hidden">
           <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8245EF]/20 to-transparent" />
           <Activity size={24} className="text-[#8245EF] animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#94a3b8] font-mono italic">END-TO-END_ENCRYPTION_STABLE</span>
        </div>

        {/* Branding Decoration */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 opacity-[0.03] pointer-events-none -z-10 grayscale group-hover/modal:opacity-[0.06] transition-opacity duration-1000">
           <Hexagon size={240} strokeWidth={1} className="text-[#8245EF] animate-spin-slow" />
        </div>
      </div>
    </div>
  );
}
