"use client";

import { useState } from "react";
import { acceptBooking, rejectBooking, completeBooking } from "@/app/actions/booking";
import { useRouter } from "next/navigation";

interface BookingActionsProps {
  bookingId: string;
  status: string;
  currentPrice?: number | null;
  currentScheduledFor?: Date | null;
}

export function BookingActions({
  bookingId,
  status,
  currentPrice,
  currentScheduledFor,
}: BookingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAcceptForm, setShowAcceptForm] = useState(false);
  const [priceQuoted, setPriceQuoted] = useState(currentPrice?.toString() || "");
  const [scheduledFor, setScheduledFor] = useState(
    currentScheduledFor
      ? new Date(currentScheduledFor).toISOString().slice(0, 16)
      : ""
  );

  async function handleAccept() {
    if (status !== "PENDING") return;

    setLoading("accept");
    setError(null);

    const result = await acceptBooking(
      bookingId,
      priceQuoted ? parseInt(priceQuoted) : undefined,
      scheduledFor ? new Date(scheduledFor) : undefined
    );

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || "Failed to accept booking");
      setLoading(null);
    }
  }

  async function handleReject() {
    if (status !== "PENDING") return;

    if (!confirm("Are you sure you want to reject this booking?")) return;

    setLoading("reject");
    setError(null);

    const result = await rejectBooking(bookingId);

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || "Failed to reject booking");
      setLoading(null);
    }
  }

  async function handleComplete() {
    if (status !== "PAID") return;

    setLoading("complete");
    setError(null);

    const result = await completeBooking(bookingId);

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || "Failed to complete booking");
      setLoading(null);
    }
  }

  if (status === "PENDING") {
    return (
      <div className="space-y-3">
        {showAcceptForm ? (
          <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-900/50 p-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-200">Price Quoted (₦)</label>
              <input
                type="number"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-50"
                value={priceQuoted}
                onChange={(e) => setPriceQuoted(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-200">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-50"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                disabled={loading === "accept"}
                className="flex-1 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-400 disabled:opacity-60"
              >
                {loading === "accept" ? "Accepting..." : "Confirm Accept"}
              </button>
              <button
                onClick={() => setShowAcceptForm(false)}
                className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setShowAcceptForm(true)}
              className="flex-1 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-400"
            >
              Accept
            </button>
            <button
              onClick={handleReject}
              disabled={loading === "reject"}
              className="flex-1 rounded-full border border-rose-500 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 disabled:opacity-60"
            >
              {loading === "reject" ? "Rejecting..." : "Reject"}
            </button>
          </div>
        )}
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    );
  }

  if (status === "ACCEPTED") {
    return (
      <div className="rounded border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-center text-xs font-medium text-amber-300">
        Waiting for payment
      </div>
    );
  }

  if (status === "PAID") {
    return (
      <div>
        <button
          onClick={handleComplete}
          disabled={loading === "complete"}
          className="w-full rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading === "complete" ? "Completing..." : "Mark as Completed"}
        </button>
        {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
      </div>
    );
  }

  return null;
}

