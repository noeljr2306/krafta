"use client";

import { useState } from "react";
import { releaseFunds, raiseDispute, confirmCashPaid } from "@/app/actions/booking";
import { useRouter } from "next/navigation";
import { Loader2, PartyPopper, AlertTriangle, X, CheckCircle2 } from "lucide-react";

interface ReleaseFundsButtonProps {
  bookingId: string;
  paymentMethod?: string | null;
  cashConfirmedByPro?: boolean;
}

function Confetti() {
  const colors = ["#f59e0b","#10b981","#3b82f6","#8b5cf6","#ef4444","#ec4899","#14b8a6"];
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.8}s`,
    size: `${6 + Math.random() * 8}px`,
    duration: `${1 + Math.random() * 0.8}s`,
  }));
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <div key={p.id} className="absolute top-0 rounded-sm"
          style={{ left: p.left, width: p.size, height: p.size, backgroundColor: p.color,
            animation: `confetti-fall ${p.duration} ${p.delay} linear forwards` }} />
      ))}
      <style>{`@keyframes confetti-fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}`}</style>
    </div>
  );
}

export function ReleaseFundsButton({ bookingId, paymentMethod, cashConfirmedByPro }: ReleaseFundsButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [done, setDone] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeLoading, setDisputeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCash = paymentMethod === "CASH";

  async function handleRelease() {
    if (!confirm("Release funds to the professional? This confirms the job is complete.")) return;
    setLoading(true);
    try {
      const result = isCash
        ? await confirmCashPaid(bookingId)
        : await releaseFunds(bookingId);

      if (result.success) {
        setShowConfetti(true);
        setDone(true);
        setTimeout(() => { setShowConfetti(false); router.refresh(); }, 3500);
      } else {
        alert(result.error || "Failed");
      }
    } catch { alert("Something went wrong"); }
    finally { setLoading(false); }
  }

  async function handleDispute() {
    if (!disputeReason.trim()) { setError("Please describe the issue"); return; }
    setDisputeLoading(true);
    try {
      const result = await raiseDispute(bookingId, disputeReason);
      if (result.success) { setShowDispute(false); router.refresh(); }
      else { setError(result.error || "Failed to raise dispute"); }
    } catch { setError("Something went wrong"); }
    finally { setDisputeLoading(false); }
  }

  if (done) {
    return (
      <>
        {showConfetti && <Confetti />}
        <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg">
          <PartyPopper className="h-4 w-4" />
          {isCash ? "Cash Confirmed! 🎉" : "Paid & Completed! 🎉"}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <button onClick={handleRelease} disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60">
          {loading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirming...</>
            : <><PartyPopper className="h-4 w-4" />
              {isCash
                ? cashConfirmedByPro
                  ? "Confirm You Paid Cash ✓"
                  : "Confirm Cash Payment"
                : "Release Funds to Professional"}
            </>
          }
        </button>

        {/* Only show dispute for escrow payments */}
        {!isCash && (
          <button onClick={() => setShowDispute(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100 transition">
            <AlertTriangle className="h-3.5 w-3.5" />
            Raise a Dispute
          </button>
        )}
      </div>

      {/* Dispute Modal */}
      {showDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[2rem] bg-white border border-slate-100 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                <p className="text-sm font-bold text-slate-900">Raise a Dispute</p>
              </div>
              <button onClick={() => { setShowDispute(false); setError(null); }}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Funds will be frozen and reviewed by the Krafta admin team. Please describe what went wrong.
            </p>

            <textarea
              value={disputeReason}
              onChange={(e) => { setDisputeReason(e.target.value); setError(null); }}
              rows={4}
              placeholder="e.g. The professional didn't complete the work as agreed..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 resize-none"
            />

            {error && (
              <p className="text-xs text-rose-600 font-medium">{error}</p>
            )}

            <button onClick={handleDispute} disabled={disputeLoading}
              className="w-full rounded-xl bg-rose-500 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/25 hover:bg-rose-400 transition disabled:opacity-60">
              {disputeLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Submit Dispute"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
