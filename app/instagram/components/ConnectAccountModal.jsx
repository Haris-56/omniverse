"use client";

import { useState } from "react";
import { X, Instagram, Loader2, AlertCircle, CheckCircle } from "lucide-react";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#FCAF45]/10">
          <div className="flex items-center gap-2 text-[#E1306C]">
            <Instagram size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Connect Instagram</h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {result ? (
            <div className="text-center py-6">
              {result.status === "Connected" ? (
                <>
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Connected Successfully!</h3>
                  <p className="text-gray-500">Your account is now ready.</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Connection Failed</h3>
                  <p className="text-red-600 font-medium mb-4">{result.reason}</p>
                  <button 
                    onClick={() => setResult(null)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#E1306C]/20 outline-none bg-gray-50 text-gray-900 placeholder:text-gray-500"
                  placeholder="instagram_user"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#E1306C]/20 outline-none bg-gray-50 text-gray-900 placeholder:text-gray-500"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-400 mt-1">
                  (Tip: Use "fail" in password to simulate error)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cookies (JSON) <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={cookies}
                  onChange={(e) => setCookies(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#E1306C]/20 outline-none h-24 font-mono text-xs bg-gray-50 text-gray-900 placeholder:text-gray-500"
                  placeholder='[{"domain": ".instagram.com", ...}]'
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect Account"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
