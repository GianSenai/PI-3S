import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Activity, BarChart3, Settings, LogOut, ShieldCheck, HardHat } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navSupervisor = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/monitoramento", label: "Monitoramento", icon: Activity },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

const navOperator = [{ to: "/operador", label: "Meu posto", icon: HardHat }] as const;

export function AppLayout({ children, requireRole }: { children: ReactNode; requireRole?: "supervisor" | "operador" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (user === null) {
      // Allow undefined briefly during hydration; only redirect after we've checked storage.
      const t = setTimeout(() => {
        if (!localStorage.getItem("epi-guardian-user")) {
          navigate({ to: "/login" });
        }
      }, 50);
      return () => clearTimeout(t);
    }
    if (requireRole && user && user.role !== requireRole) {
      navigate({ to: user.role === "supervisor" ? "/dashboard" : "/operador" });
    }
  }, [user, requireRole, navigate]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Carregando...
      </div>
    );
  }

  const nav = user.role === "supervisor" ? navSupervisor : navOperator;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex items-center gap-2 border-b border-sidebar-border px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-sidebar-foreground">Securi&Tech</p>
            <p className="text-xs text-muted-foreground">EPI Guardian</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="mb-2 px-2 text-xs">
            <p className="font-medium text-sidebar-foreground">{user.name}</p>
            <p className="text-muted-foreground">
              {user.role === "supervisor" ? "Supervisor" : "Operador"} • Mat. {user.matricula}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              logout();
              navigate({ to: "/login" });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card/40 px-6 py-3 backdrop-blur">
          <div>
            <h1 className="text-sm font-medium text-muted-foreground">
              {nav.find((n) => pathname.startsWith(n.to))?.label ?? "EPI Guardian"}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden font-mono sm:inline">{new Date().toLocaleString("pt-BR")}</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              Conectado
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
