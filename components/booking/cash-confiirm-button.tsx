"use client";

import { useState } from "react";
import { confirmCashReceived } from "@/app/actions/booking";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

export function CashConfirmButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handle() {
    if (!confirm("Confirm you received the cash payment from the customer?")) return;
    setLoading(true);
    try {
      const result = await confirmCashReceived(bookingId);
      if (result.success) router.refresh();
      else alert(result.error || "Failed to confirm");
    } catch { alert("Something went wrong"); }
    finally { setLoading(false); }
  }

  return (
    <button onClick={handle} disabled={loading}
      className="flex items-center gap-2 rounded-xl bg-amber-500/20 border border-amber-500/30 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/30 transition disabled:opacity-60">
      {loading
        ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Confirming...</>
        : <><CheckCircle2 className="h-3.5 w-3.5" /> Confirm Cash Received</>
      }
    </button>
  );
}
