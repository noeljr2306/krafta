"use client";

import { useState } from "react";
import { verifyTechnician } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

interface VerifyTechnicianButtonProps {
  technicianId: string;
  isVerified: boolean;
}

export function VerifyTechnicianButton({
  technicianId,
  isVerified,
}: VerifyTechnicianButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const result = await verifyTechnician(technicianId, !isVerified);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to update verification");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
        isVerified
          ? "border border-slate-700 text-slate-400 hover:bg-slate-800"
          : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
      } disabled:opacity-60`}
    >
      {loading ? "..." : isVerified ? "Unverify" : "Verify"}
    </button>
  );
}

