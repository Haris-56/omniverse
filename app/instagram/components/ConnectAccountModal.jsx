"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Instagram, 
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
    
    if (result?.status !== "Checkpoint" && result?.status !== "TwoFactor") {
        setResult(null);
    }

    try {
      const res = await fetch("/api/instagram/accounts", {
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
        if (data.status === "Checkpoint" || data.status === "TwoFactor") {
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
      
      <div className="bg-white rounded-[4rem] shadow-[0_80px_160px_rgba(130, 69, 239,0.2)] w-full max-w-7xl overflow-hidden border border-[#8245EF]/20 relative z-10 animate-in zoom-in-95 duration-1000 my-auto">
        
        <div className="p-10 border-b border-[#8245EF]/10 flex justify-between items-center bg-[#FCF8FE]/50">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-[#FCF8FE] text-[#8245EF] rounded-[1.75rem] flex items-center justify-center shadow-sm border border-[#8245EF]/10">
                <Instagram size={32} />
             </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Add Instagram Account</h2>
                <p className="text-xs text-gray-400 mt-1">Link your account safely</p>
              </div>
          </div>
          <button onClick={handleClose} className="p-4 bg-[#FCF8FE] hover:bg-[#8245EF] group rounded-[1.25rem] transition-all border border-[#8245EF]/10 text-[#94a3b8] hover:text-white">
            <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <div className="p-12 custom-scrollbar max-h-[70vh] overflow-y-auto">
          {result && result.status !== "Checkpoint" && result.status !== "TwoFactor" ? (
            <div className="text-center py-16 animate-in slide-in-from-bottom duration-500">
              {result.status === "Connected" ? (
                <>
                   <div className="w-24 h-24 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-100">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Account Connected</h3>
                  <p className="text-gray-500 text-lg">Your account is now connected and ready to use.</p>
                </>
              ) : (
                <>
                   <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-rose-100">
                    <AlertCircle size={40} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Login Failed</h3>
                  <p className="text-rose-500 font-bold mb-10 text-lg italic">{result.reason}</p>
                  <button 
                    onClick={() => setResult(null)}
                    className="px-10 py-5 bg-[#8245EF] text-white font-bold rounded-xl hover:bg-[#6d28d9] transition-all shadow-lg text-xs uppercase"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-10">
              {error && (
                <div className="p-6 bg-rose-500/5 border border-rose-500/10 text-rose-500 text-xs font-bold rounded-2xl flex items-center gap-4">
                  <AlertCircle size={22} />
                  {error}
                </div>
              )}

              {(result?.status === "Checkpoint" || result?.status === "TwoFactor") ? (
                <div className="space-y-10 animate-in slide-in-from-top-4 duration-500">
                   <div className="p-8 bg-[#8245EF]/5 border border-[#8245EF]/10 rounded-[2.5rem] flex gap-6 items-center">
                      <div className="p-5 bg-white rounded-2xl text-[#8245EF] border border-[#8245EF]/10 shadow-sm">
                         <Lock size={26} />
                      </div>
                       <div>
                          <p className="text-xl font-bold text-gray-900">Security Code</p>
                          <p className="text-xs text-gray-400 mt-1">Please enter the code sent to your phone or email.</p>
                       </div>
                   </div>

                   <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 ml-2">Security Code</label>
                    <input
                      type="text"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-10 py-5 text-center text-3xl font-bold tracking-[0.5em] text-gray-900 outline-none focus:border-[#8245EF] transition-all shadow-sm"
                      placeholder="000000"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 ml-2">Username or Email</label>
                       <div className="relative group">
                         <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input
                           type="text"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-16 pr-6 py-4 text-sm font-medium text-gray-900 outline-none focus:border-[#8245EF] transition-all shadow-sm"
                           placeholder="your_username"
                         />
                       </div>
                     </div>

                     <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 ml-2">Password</label>
                       <div className="relative group">
                         <Key size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input
                           type="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-16 pr-6 py-4 text-sm font-medium text-gray-900 outline-none focus:border-[#8245EF] transition-all shadow-sm"
                           placeholder="••••••••••••"
                         />
                       </div>
                     </div>
                  </div>

                   <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 ml-2">Cookies (Optional)</label>
                     <textarea
                       value={cookies}
                       onChange={(e) => setCookies(e.target.value)}
                       className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs text-gray-500 outline-none h-28 focus:border-[#8245EF] transition-all shadow-sm resize-none"
                       placeholder='[{"domain": ".instagram.com", ...}]'
                     />
                   </div>
                  
                  <div className="pt-10 border-t border-[#8245EF]/10 space-y-8">
                     <div className="flex items-center gap-3 cursor-pointer" onClick={() => setUseProxy(!useProxy)}>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${useProxy ? 'bg-[#8245EF] border-[#8245EF]' : 'border-gray-200 bg-white'}`}>
                           {useProxy && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <span className="text-xs font-bold text-gray-500">
                           Use Proxy (Optional)
                        </span>
                     </div>

                    {useProxy && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-4 duration-500">
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-400 ml-2">Proxy Host</label>
                              <input
                                 type="text"
                                 value={proxyHost}
                                 onChange={(e) => setProxyHost(e.target.value)}
                                 className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-[#8245EF] shadow-sm"
                                 placeholder="0.0.0.0"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-400 ml-2">Proxy Port</label>
                              <input
                                 type="text"
                                 value={proxyPort}
                                 onChange={(e) => setProxyPort(e.target.value)}
                                 className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-[#8245EF] shadow-sm"
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
                className="w-full bg-[#8245EF] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-[#6d28d9] transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98] mt-8"
              >
                {loading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Rocket size={24} />
                    <span>{result?.status === "Checkpoint" || result?.status === "TwoFactor" ? "Verify Code" : "Connect Account"}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
        
        <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2">
            <Activity size={16} className="text-[#8245EF]" />
            <span className="text-xs font-bold text-gray-400">Your information is secure</span>
         </div>
      </div>
    </div>
  );
}
