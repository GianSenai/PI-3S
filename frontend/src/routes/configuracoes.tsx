import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { employees as seedEmps, stations as seedStations } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracoes")({
  component: () => (
    <AppLayout requireRole="supervisor">
      <Configuracoes />
    </AppLayout>
  ),
});

function Configuracoes() {
  const [maxPause, setMaxPause] = useState(60);
  const [yoloConf, setYoloConf] = useState(80);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [emps, setEmps] = useState(seedEmps);
  const [sts, setSts] = useState(seedStations);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-sm text-muted-foreground">Parâmetros do sistema, funcionários e estações.</p>
      </div>

      <Tabs defaultValue="parametros">
        <TabsList>
          <TabsTrigger value="parametros">Parâmetros</TabsTrigger>
          <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
          <TabsTrigger value="estacoes">Estações</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="parametros" className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Tempo máximo de pausa sem EPI</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label>Segundos</Label>
                <span className="font-mono text-lg">{maxPause}s</span>
              </div>
              <Slider value={[maxPause]} min={10} max={300} step={5} onValueChange={(v) => setMaxPause(v[0])} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Sensibilidade da IA (YOLO)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label>Confiança mínima</Label>
                <span className="font-mono text-lg">{yoloConf}%</span>
              </div>
              <Slider value={[yoloConf]} min={50} max={99} step={1} onValueChange={(v) => setYoloConf(v[0])} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Comportamento</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Som em alertas</Label>
                  <p className="text-xs text-muted-foreground">Toca alarme quando EPI é removido</p>
                </div>
                <Switch checked={soundAlerts} onCheckedChange={setSoundAlerts} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Bloqueio automático</Label>
                  <p className="text-xs text-muted-foreground">Trava máquina sob violação</p>
                </div>
                <Switch checked={autoLock} onCheckedChange={setAutoLock} />
              </div>
              <Button onClick={() => toast.success("Configurações salvas")}>Salvar alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funcionarios" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Cadastro de funcionários</CardTitle>
              <Button size="sm" onClick={() => {
                const id = `e${Date.now()}`;
                setEmps([...emps, { id, matricula: String(20000 + emps.length + 1), name: "Novo funcionário", role: "operador", sector: "Solda A" }]);
                toast.success("Funcionário adicionado");
              }}>
                <Plus className="mr-1 h-4 w-4" /> Novo
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Matrícula</TableHead><TableHead>Nome</TableHead><TableHead>Setor</TableHead><TableHead>Perfil</TableHead><TableHead></TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {emps.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-mono">{e.matricula}</TableCell>
                      <TableCell>{e.name}</TableCell>
                      <TableCell className="text-muted-foreground">{e.sector}</TableCell>
                      <TableCell className="capitalize">{e.role}</TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" onClick={() => setEmps(emps.filter((x) => x.id !== e.id))}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estacoes" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Estações / máquinas</CardTitle>
              <Button size="sm" onClick={() => toast.message("Abrir formulário de nova estação")}><Plus className="mr-1 h-4 w-4" /> Nova</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>ID</TableHead><TableHead>Nome</TableHead><TableHead>Setor</TableHead><TableHead>Localização</TableHead><TableHead>Câmera</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {sts.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono">{s.id}</TableCell>
                      <TableCell>
                        <Input defaultValue={s.name} className="h-8" onBlur={(e) => setSts(sts.map((x) => x.id === s.id ? { ...x, name: e.target.value } : x))} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">{s.sector}</TableCell>
                      <TableCell className="text-muted-foreground">{s.location}</TableCell>
                      <TableCell className="font-mono text-xs">{s.cameraUrl}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Gerenciamento de alertas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">Notificar supervisor por e-mail</p>
                  <p className="text-xs text-muted-foreground">Envia e-mail para alertas críticos</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">Webhook integrado (Slack/Teams)</p>
                  <p className="text-xs text-muted-foreground">Envia mensagem para canal industrial</p>
                </div>
                <Switch />
              </div>
              <div>
                <Label htmlFor="wh">URL do Webhook</Label>
                <Input id="wh" placeholder="https://hooks.slack.com/..." className="mt-1" />
              </div>
              <Button onClick={() => toast.success("Configurações de alertas salvas")}>Salvar</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
