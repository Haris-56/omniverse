"use client";

import { useState } from "react";
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
  Camera
} from "lucide-react";

export default function ConnectAccountModal({ isOpen, onClose, onAccountConnected }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookies] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Username and Password are required");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/instagram/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, cookies }),
      });

      const data = await res.json();

      if (!res.ok) {
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
    setError("");
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white animate-in zoom-in duration-300">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-pink-50/30">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                <Camera size={24} />
             </div>
             <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight lowercase">Connect Instagram</h2>
                <p className="text-[10px] font-black text-[#E1306C] uppercase tracking-[0.2em] mt-0.5">Visual Uplink Protocol</p>
             </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100 text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 md:p-10">
          {result ? (
            <div className="text-center py-10 animate-in slide-in-from-bottom duration-500">
              {result.status === "Connected" ? (
                <>
                  <div className="w-20 h-20 bg-pink-50 text-[#E1306C] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 lowercase tracking-tight mb-2">Node Connected</h3>
                  <p className="text-gray-500 text-sm font-medium tracking-tight">Visual handshake successful. Ready for engagement streams.</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <AlertCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 lowercase tracking-tight mb-2">Uplink Failed</h3>
                  <p className="text-red-500 font-bold mb-8 text-sm">{result.reason}</p>
                  <button 
                    onClick={() => setResult(null)}
                    className="px-8 py-4 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-all shadow-xl"
                  >
                    Resync Pulse
                  </button>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold rounded-2xl flex items-center gap-3 animate-in slide-in-from-top">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 ml-1">
                   <User size={12} className="text-[#E1306C]" />
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Username / Email</label>
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-pink-500/5 focus:border-pink-500/20 focus:bg-white transition-all shadow-sm"
                  placeholder="instagram_node"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 ml-1">
                   <Key size={12} className="text-[#E1306C]" />
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entry Key</label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-pink-500/5 focus:border-pink-500/20 focus:bg-white transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 ml-1">
                   <Terminal size={12} className="text-[#E1306C]" />
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Session Logic (JSON)</label>
                </div>
                <textarea
                  value={cookies}
                  onChange={(e) => setCookies(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-6 py-4 text-xs font-mono text-gray-600 outline-none h-24 focus:ring-4 focus:ring-pink-500/5 focus:border-pink-500/20 focus:bg-white transition-all shadow-sm resize-none"
                  placeholder='[{"domain": ".instagram.com", ...}]'
                />
              </div>

              <div className="pt-4 flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-pink-500/20 hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Establishing Uplink...
                    </>
                  ) : (
                    <>
                      <Rocket size={18} />
                      Initialize Uplink
                    </>
                  )}
                </button>
                
                <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-50 flex gap-3 text-left">
                   <Info size={16} className="text-[#E1306C] shrink-0" />
                   <p className="text-[10px] font-medium text-[#E1306C]/80 leading-relaxed italic">
                      Visual nodes are sandboxed for integrity. Ensure multi-factor authentication is handled if prompted on your primary device.
                   </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
