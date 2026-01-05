"use client";

import { useState } from "react";
import { deleteUser } from "@/app/actions/admin";
import { useRouter } from "next/navigation";

interface DeleteUserButtonProps {
  userId: string;
}

export function DeleteUserButton({ userId }: DeleteUserButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    const result = await deleteUser(userId);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to delete user");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-full bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-60"
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
