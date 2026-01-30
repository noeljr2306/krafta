import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AuthLoginForm } from "@/components/auth/login-form";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user && (session.user as any).role) {
    const role = (session.user as any).role as string;
    if (role === "ADMIN") redirect("/admin");
    if (role === "PROFESSIONAL") redirect("/professional");
    if (role === "CUSTOMER") redirect("/customer");
    redirect("/");
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4">
      <AuthLoginForm />
    </div>
  );
}
