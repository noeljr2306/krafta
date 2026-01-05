"use client";

import { useState, FormEvent } from "react";
import { createBooking } from "@/app/actions/booking";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  technicianId: string;
}

export function BookingForm({ technicianId }: BookingFormProps) {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!description.trim() || !address.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    const result = await createBooking(
      technicianId,
      description,
      address,
      scheduledFor ? new Date(scheduledFor) : undefined
    );

    if (result.success) {
      router.push("/customer?booking=success");
    } else {
      setError(result.error || "Failed to create booking");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-lg font-semibold text-slate-50">Book this technician</h2>
      <p className="mt-1 text-xs text-slate-400">
        Describe your service need and provide your address
      </p>

      <div className="mt-6 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-200">Service Description *</label>
          <textarea
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Kitchen sink leaking, need repair..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-200">Service Address *</label>
          <input
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your full address"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-200">Preferred Date & Time</label>
          <input
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Optional. Technician will confirm availability.
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-xs font-medium text-rose-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating booking..." : "Request Booking"}
      </button>

      <p className="mt-3 text-[11px] text-slate-500">
        The technician will review your request and respond within 24 hours.
      </p>
    </form>
  );
}

