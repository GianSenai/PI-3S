import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, KeyRound, IdCard, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const u = login(matricula, password);
      setLoading(false);
      if (!u) {
        toast.error("Matrícula não encontrada", { description: "Tente 20001 (supervisor) ou 10234 (operador)." });
        return;
      }
      toast.success(`Bem-vindo, ${u.name.split(" ")[0]}`);
      navigate({ to: u.role === "supervisor" ? "/dashboard" : "/operador" });
    }, 350);
  };

  const handleRfid = () => {
    setLoading(true);
    setTimeout(() => {
      const u = login("10234", "");
      setLoading(false);
      if (u) {
        toast.success(`Crachá RFID lido — ${u.name}`);
        navigate({ to: "/operador" });
      }
    }, 700);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,oklch(0.3_0.08_240)_0%,transparent_55%),radial-gradient(circle_at_75%_80%,oklch(0.28_0.1_145)_0%,transparent_50%)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Securi&Tech</h1>
          <p className="text-sm text-muted-foreground">EPI Guardian — Acesso restrito</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-2xl">
          <Tabs defaultValue="matricula" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="matricula">
                <KeyRound className="mr-2 h-4 w-4" /> Matrícula
              </TabsTrigger>
              <TabsTrigger value="rfid">
                <Radio className="mr-2 h-4 w-4" /> RFID
              </TabsTrigger>
            </TabsList>

            <TabsContent value="matricula" className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="matricula">Matrícula</Label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="matricula"
                      placeholder="Ex.: 20001"
                      className="pl-9"
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Autenticando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="rfid" className="mt-4">
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-primary/40 text-primary">
                  <Radio className="h-10 w-10" />
                  <span className="absolute inset-0 animate-ping rounded-full border border-primary/30" />
                </div>
                <p className="text-sm text-muted-foreground">Aproxime o crachá do leitor RFID</p>
                <Button onClick={handleRfid} disabled={loading} className="w-full">
                  {loading ? "Lendo crachá..." : "Simular leitura"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Demo: <span className="font-mono">20001</span> (supervisor) ou <span className="font-mono">10234</span> (operador) — qualquer senha.
        </p>
      </div>
    </div>
  );
}
