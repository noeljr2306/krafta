"use client";

import { useState, FormEvent } from "react";
import { submitReview } from "@/app/actions/review";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  bookingId: string;
  technicianId: string;
}

export function ReviewForm({ bookingId, technicianId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!comment.trim()) {
      setError("Please provide a comment");
      return;
    }

    setLoading(true);

    const result = await submitReview(bookingId, rating, comment);

    if (result.success) {
      setSubmitted(true);
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } else {
      setError(result.error || "Failed to submit review");
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-4 text-center">
        <p className="text-sm font-medium text-emerald-400">Review submitted successfully!</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-200">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl transition ${
                star <= rating ? "text-yellow-400" : "text-slate-600"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-200">Your Review</label>
        <textarea
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-0 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
          rows={4}
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
        />
      </div>

      {error && (
        <p className="text-xs font-medium text-rose-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

