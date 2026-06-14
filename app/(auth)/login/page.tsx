import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="font-mono text-xs uppercase tracking-widest text-turquoise mb-2 text-center">
          Swiftflow. <span className="text-ink/40">multi-agent marketing</span>
        </div>
        <h1 className="text-xl font-semibold mb-6 text-center">Connexion</h1>
        <LoginForm />
      </div>
    </div>
  );
}
