"use client";

import { useState, useTransition } from "react";
import { resolveDispute } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export function DisputeResolutionButtons({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [active, setActive] = useState<"release" | "refund" | null>(null);

  function handle(resolution: "release" | "refund") {
    const msg = resolution === "release"
      ? "Release funds to the professional? This closes the dispute in their favour."
      : "Refund funds to the customer? This closes the dispute in their favour.";
    if (!confirm(msg)) return;
    setActive(resolution);
    startTransition(async () => {
      const result = await resolveDispute(bookingId, resolution);
      if (result.success) router.refresh();
      else { alert(result.error); setActive(null); }
    });
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => handle("release")} disabled={isPending}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-500/25 transition disabled:opacity-50">
        {isPending && active === "release" ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
        Release to Pro
      </button>
      <button onClick={() => handle("refund")} disabled={isPending}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-500/25 transition disabled:opacity-50">
        {isPending && active === "refund" ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
        Refund Customer
      </button>
    </div>
  );
}
