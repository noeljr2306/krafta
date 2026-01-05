"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createProfessionalProfile,
  ProfessionalProfileData,
} from "@/app/actions/professional";

const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Cleaning",
  "HVAC",
  "Appliance Repair",
  "Landscaping",
  "Moving",
  "General Handyman",
];

export function ProfileSetupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfessionalProfileData>({
    title: "",
    bio: "",
    skills: "",
    categories: [], // ✅ FIX: now an array
    city: "",
    area: "",
    baseRate: undefined,
    hourlyRate: undefined,
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  function handleCategoryToggle(category: string) {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];

      setFormData((f) => ({
        ...f,
        categories: newCategories, // ✅ FIX
      }));

      return newCategories;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      !formData.title ||
      !formData.bio ||
      !formData.city ||
      !formData.area ||
      formData.categories.length === 0
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const result = await createProfessionalProfile(formData);
    console.log("Profile creation result:", result); // ✅ DEBUG

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || "Failed to create profile");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8"
    >
      {error && (
        <div className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">
            Professional Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Master Plumber, Expert Electrician"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-slate-500 focus:outline-none"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">
            Bio / About You
          </label>
          <textarea
            required
            rows={4}
            placeholder="Describe your experience and services..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-slate-500 focus:outline-none"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">
              City
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lagos"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-slate-500 focus:outline-none"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Area / Neighborhood
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lekki Phase 1"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-slate-500 focus:outline-none"
              value={formData.area}
              onChange={(e) =>
                setFormData({ ...formData, area: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Base Visit Fee (₦)
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-slate-500 focus:outline-none"
              value={formData.baseRate ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  baseRate:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Hourly Rate (₦) (Optional)
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-slate-500 focus:outline-none"
              value={formData.hourlyRate ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hourlyRate:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
            Service Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryToggle(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  selectedCategories.includes(cat)
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">
            Skills (Comma separated)
          </label>
          <input
            type="text"
            placeholder="e.g. Pipe fitting, Leak detection, Installation"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-slate-500 focus:outline-none"
            value={formData.skills}
            onChange={(e) =>
              setFormData({ ...formData, skills: e.target.value })
            }
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? "Creating Profile..." : "Create Professional Profile"}
        </button>
      </div>
    </form>
  );
}
