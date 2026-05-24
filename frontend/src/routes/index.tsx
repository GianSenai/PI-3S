import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("epi-guardian-user") : null;
    if (user) {
      navigate({ to: user.role === "supervisor" ? "/dashboard" : "/operador" });
    } else if (!stored) {
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
      Carregando EPI Guardian...
    </div>
  );
}
