import { Paintbrush, RotateCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/utils/api";

const STARTER_CSS = `/* Applicato solo quando questa organizzazione è attiva */
:root {
  /* --primary: oklch(0.55 0.2 250); */
}

/* Esempio:
[data-slot="card"] {
  border-radius: 12px;
}
*/`;

export function OrganizationStyleSettings() {
  const { data, isLoading } = api.organization.getStyle.useQuery();
  const [css, setCss] = useState("");
  const utils = api.useUtils();
  const update = api.organization.updateStyle.useMutation();

  useEffect(() => {
    if (data !== undefined) setCss(data?.customCss ?? "");
  }, [data]);

  const save = async () => {
    try {
      await update.mutateAsync({ customCss: css || null });
      await utils.organization.getStyle.invalidate();
      toast.success("CSS dell’organizzazione salvato");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Impossibile salvare il CSS",
      );
    }
  };

  return (
    <Card className="mx-auto w-full max-w-5xl">
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Paintbrush />
        </div>
        <CardTitle>CSS personalizzato dell’organizzazione</CardTitle>
        <CardDescription>
          Questo foglio di stile viene salvato separatamente per
          l’organizzazione attiva e applicato automaticamente quando gli utenti
          passano a questa organizzazione.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={css}
          onChange={(event) => setCss(event.target.value)}
          disabled={isLoading}
          spellCheck={false}
          aria-label="CSS personalizzato dell’organizzazione"
          className="min-h-[420px] resize-y font-mono text-sm leading-6"
          placeholder={STARTER_CSS}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Le modifiche verranno applicate a tutti gli utenti
            dell’organizzazione dopo l’aggiornamento della pagina.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCss(STARTER_CSS)}>
              <RotateCcw /> Usa modello
            </Button>
            <Button onClick={() => void save()} isLoading={update.isPending}>
              <Save /> Salva CSS
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
