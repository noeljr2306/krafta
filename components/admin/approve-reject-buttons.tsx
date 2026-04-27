"use client";

import { useState, useTransition } from "react";
import { verifyTechnician } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export function ApproveRejectButtons({ technicianId }: { technicianId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [active, setActive] = useState<"approve" | "reject" | null>(null);

  function handle(action: "approve" | "reject") {
    setActive(action);
    startTransition(async () => {
      const result = await verifyTechnician(technicianId, action);
      if (result.success) router.refresh();
      else { alert(result.error || "Failed"); setActive(null); }
    });
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => handle("approve")} disabled={isPending}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-500/25 transition disabled:opacity-50">
        {isPending && active === "approve" ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
        Approve
      </button>
      <button onClick={() => handle("reject")} disabled={isPending}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-500/25 transition disabled:opacity-50">
        {isPending && active === "reject" ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
        Reject
      </button>
    </div>
  );
}
