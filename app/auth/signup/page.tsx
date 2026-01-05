import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AuthSignupForm } from "@/components/auth/signup-form";
import { authOptions } from "@/lib/auth";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  // Redirect if already logged in
  if (session?.user && (session.user as any).role) {
    const role = (session.user as any).role as string;
    if (role === "ADMIN") redirect("/admin");
    if (role === "PROFESSIONAL") redirect("/professional");
    if (role === "CUSTOMER") redirect("/customer");
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950/90 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-900/80 p-8 shadow-xl ring-1 ring-slate-800">
        <AuthSignupForm />
      </div>
    </div>
  );
}

