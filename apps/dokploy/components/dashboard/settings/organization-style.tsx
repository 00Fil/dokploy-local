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

const STARTER_CSS = `/* Applied only while this organization is active */
:root {
  /* --primary: oklch(0.55 0.2 250); */
}

/* Example:
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
      toast.success("Organization CSS saved");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save CSS",
      );
    }
  };

  return (
    <Card className="mx-auto w-full max-w-5xl">
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Paintbrush />
        </div>
        <CardTitle>Organization custom CSS</CardTitle>
        <CardDescription>
          This stylesheet is stored separately for the active organization and
          is automatically applied when users switch to it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={css}
          onChange={(event) => setCss(event.target.value)}
          disabled={isLoading}
          spellCheck={false}
          aria-label="Organization custom CSS"
          className="min-h-[420px] resize-y font-mono text-sm leading-6"
          placeholder={STARTER_CSS}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Changes affect every user in this organization after refresh.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCss(STARTER_CSS)}>
              <RotateCcw /> Use template
            </Button>
            <Button onClick={() => void save()} isLoading={update.isPending}>
              <Save /> Save CSS
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
