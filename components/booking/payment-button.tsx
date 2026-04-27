"use client";

import { useState } from "react";
import { payWithEscrow, payWithCash } from "@/app/actions/booking";
import { X, Wallet, CheckCircle2, Lock, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentButtonProps {
  bookingId: string;
  price: number;
}

type Step = "idle" | "choose" | "escrow_confirm" | "escrow_processing" | "escrow_done" | "cash_confirm" | "cash_done";

export function PaymentButton({ bookingId, price }: PaymentButtonProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);

  function reset() { setStep("idle"); setError(null); }

  async function handleEscrow() {
    setStep("escrow_processing");
    setError(null);
    try {
      const result = await payWithEscrow(bookingId);
      if (result.success) {
        setStep("escrow_done");
        setTimeout(() => { reset(); router.refresh(); }, 2000);
      } else {
        setError(result.error || "Payment failed");
        setStep("escrow_confirm");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setStep("escrow_confirm");
    }
  }

  async function handleCash() {
    setError(null);
    try {
      const result = await payWithCash(bookingId);
      if (result.success) {
        setStep("cash_done");
        setTimeout(() => { reset(); router.refresh(); }, 2000);
      } else {
        setError(result.error || "Failed");
        setStep("cash_confirm");
      }
    } catch {
      setError("Something went wrong");
      setStep("cash_confirm");
    }
  }

  return (
    <>
      <button
        onClick={() => setStep("choose")}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Wallet className="h-4 w-4" />
        Pay for This Job · ₦{price.toLocaleString()}
      </button>

      {step !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[2rem] bg-white border border-slate-100 shadow-2xl overflow-hidden">

            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-900">Payment</p>
                <p className="text-[10px] text-slate-400">₦{price.toLocaleString()} · Krafta Secure</p>
              </div>
              {!["escrow_processing", "escrow_done", "cash_done"].includes(step) && (
                <button onClick={reset} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 transition">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="p-6 space-y-3">

              {step === "choose" && (
                <>
                  <p className="text-xs font-bold text-slate-500 text-center mb-4">How would you like to pay?</p>

                  <button
                    onClick={() => setStep("escrow_confirm")}
                    className="w-full rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 p-4 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <Lock className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Secure Escrow</p>
                        <p className="text-[10px] text-indigo-500 font-semibold">Recommended</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Funds locked until job is complete. Auto-releases in 48hrs. Dispute protection included.
                    </p>
                  </button>

                  <button
                    onClick={() => setStep("cash_confirm")}
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 p-4 text-left transition-all hover:border-slate-200 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center">
                        <span className="text-lg">💵</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Pay Cash on Arrival</p>
                        <p className="text-[10px] text-slate-400 font-semibold">No platform fee</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Pay the professional directly when they arrive. Both parties confirm after payment.
                    </p>
                  </button>
                </>
              )}

              {step === "escrow_confirm" && (
                <>
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Amount</span>
                      <span className="font-black text-slate-900">₦{price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Held Until</span>
                      <span className="font-bold text-slate-700">Job Confirmed</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Auto-Release</span>
                      <span className="font-bold text-indigo-600">48 hours</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Dispute Window</span>
                      <span className="font-bold text-amber-600">Within 48hrs</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3">
                    <p className="text-[11px] text-indigo-700 leading-relaxed">
                      🔒 Your money is locked on the platform. The professional can only receive it once you confirm the job is done, or after 48 hours with no dispute.
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-xl bg-rose-50 border border-rose-100 p-3">
                      <p className="text-xs text-rose-600 font-medium">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button onClick={() => setStep("choose")}
                      className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
                      Back
                    </button>
                    <button onClick={handleEscrow}
                      className="flex-1 rounded-xl bg-indigo-500 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400 transition-all hover:scale-[1.02]">
                      Lock in Escrow
                    </button>
                  </div>
                </>
              )}

              {step === "escrow_processing" && (
                <div className="py-8 flex flex-col items-center gap-4 text-center">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
                    <Lock className="absolute inset-0 m-auto h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Locking Funds in Escrow...</p>
                    <p className="text-xs text-slate-400 mt-1">This only takes a moment</p>
                  </div>
                </div>
              )}

              {step === "escrow_done" && (
                <div className="py-6 flex flex-col items-center gap-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Funds Secured in Escrow ✓</p>
                    <p className="text-xs text-slate-400 mt-1">Auto-releases in 48hrs if no dispute raised</p>
                  </div>
                </div>
              )}

              {step === "cash_confirm" && (
                <>
                  <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <p className="text-sm font-bold text-amber-800">Cash Payment Notice</p>
                    </div>
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      You&apos;re agreeing to pay ₦{price.toLocaleString()} in cash when the professional arrives. Both parties must confirm after payment.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Amount</span>
                      <span className="font-black text-slate-900">₦{price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Platform Protection</span>
                      <span className="font-bold text-amber-600">Limited</span>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl bg-rose-50 border border-rose-100 p-3">
                      <p className="text-xs text-rose-600 font-medium">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button onClick={() => setStep("choose")}
                      className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
                      Back
                    </button>
                    <button onClick={handleCash}
                      className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/25 hover:bg-amber-400 transition-all hover:scale-[1.02]">
                      Confirm Cash
                    </button>
                  </div>
                </>
              )}

              {step === "cash_done" && (
                <div className="py-6 flex flex-col items-center gap-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Cash Payment Selected ✓</p>
                    <p className="text-xs text-slate-400 mt-1">Confirm payment after the professional arrives</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}