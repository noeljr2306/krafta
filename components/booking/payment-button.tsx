"use client";

import { useState } from "react";
import { payBooking } from "@/app/actions/booking";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentButtonProps {
  bookingId: string;
  price: number;
}

export function PaymentButton({ bookingId, price }: PaymentButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    if (!confirm(`Confirm payment of ₦${price.toLocaleString()}?`)) return;

    setLoading(true);
    try {
      const result = await payBooking(bookingId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Processing...
        </>
      ) : (
        `Pay Now (₦${price.toLocaleString()})`
      )}
    </button>
  );
}
