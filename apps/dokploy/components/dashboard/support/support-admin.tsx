import { CheckCircle2, Clock3, Inbox, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";

const statusVariant = {
  open: "blue",
  pending: "yellow",
  closed: "green",
} as const;

const userLabel = (user: {
  firstName: string;
  lastName: string;
  email: string;
}) => [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

export function SupportAdmin() {
  const [selectedId, setSelectedId] = useState<string>();
  const [reply, setReply] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const utils = api.useUtils();
  const { data: conversations = [] } = api.support.list.useQuery(undefined, {
    refetchInterval: 5000,
  });
  const { data: conversation } = api.support.conversation.useQuery(
    { conversationId: selectedId ?? "" },
    { enabled: !!selectedId, refetchInterval: 4000 },
  );
  const replyMutation = api.support.reply.useMutation();
  const statusMutation = api.support.setStatus.useMutation();

  useEffect(() => {
    if (!selectedId && conversations[0]) setSelectedId(conversations[0].id);
  }, [conversations, selectedId]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length]);

  const refresh = async () => {
    await Promise.all([
      utils.support.list.invalidate(),
      utils.support.conversation.invalidate(),
    ]);
  };

  const sendReply = async () => {
    if (!selectedId || !reply.trim()) return;
    try {
      await replyMutation.mutateAsync({
        conversationId: selectedId,
        body: reply.trim(),
      });
      setReply("");
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to send reply",
      );
    }
  };

  const setStatus = async (status: "open" | "pending" | "closed") => {
    if (!selectedId) return;
    await statusMutation.mutateAsync({ conversationId: selectedId, status });
    await refresh();
  };

  return (
    <div className="grid min-h-[70vh] grid-cols-1 gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
      <Card className="overflow-hidden">
        <div className="border-b p-4">
          <h1 className="text-lg font-semibold">Support conversations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage member requests for this organization.
          </p>
        </div>
        <ScrollArea className="h-[62vh]">
          <div className="flex flex-col p-2">
            {conversations.length === 0 && (
              <div className="flex flex-col items-center gap-2 px-6 py-16 text-center text-muted-foreground">
                <Inbox className="size-8" />
                <p>No support conversations yet.</p>
              </div>
            )}
            {conversations.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  "rounded-lg p-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selectedId === item.id && "bg-muted",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-medium">
                    {userLabel(item.requester)}
                  </p>
                  <Badge variant={statusVariant[item.status]}>
                    {item.status}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {item.messages[0]?.body || item.subject}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(item.updatedAt).toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Card className="min-w-0 overflow-hidden">
        {conversation ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
              <div>
                <h2 className="font-semibold">
                  {userLabel(conversation.requester)}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {conversation.requester.email}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void setStatus("open")}
                >
                  <Clock3 /> Open
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void setStatus("pending")}
                >
                  Pending
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void setStatus("closed")}
                >
                  <CheckCircle2 /> Close
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[48vh] bg-muted/20 p-4">
              <div className="flex flex-col gap-3 pr-3">
                {conversation.messages.map((message) => {
                  const admin = message.senderRole === "admin";
                  return (
                    <div
                      key={message.id}
                      className={
                        admin
                          ? "ml-12 flex justify-end"
                          : "mr-12 flex justify-start"
                      }
                    >
                      <div
                        className={
                          admin
                            ? "max-w-2xl rounded-xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground"
                            : "max-w-2xl rounded-xl rounded-bl-sm border bg-background px-3 py-2"
                        }
                      >
                        <p className="whitespace-pre-wrap break-words text-sm">
                          {message.body}
                        </p>
                        <p className="mt-1 text-[11px] opacity-65">
                          {userLabel(message.sender)} ·{" "}
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>
            <div className="flex gap-2 border-t p-4">
              <Textarea
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                placeholder="Reply to the member…"
                className="min-h-11 max-h-32 resize-none"
              />
              <Button
                size="icon"
                onClick={() => void sendReply()}
                disabled={!reply.trim()}
                isLoading={replyMutation.isPending}
                aria-label="Send reply"
              >
                <Send />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex min-h-[60vh] items-center justify-center p-8 text-center text-muted-foreground">
            Select a conversation to view its messages.
          </div>
        )}
      </Card>
    </div>
  );
}
