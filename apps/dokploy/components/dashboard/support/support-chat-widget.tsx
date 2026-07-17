import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

export function SupportChatWidget() {
  const { data: auth } = api.user.get.useQuery();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const utils = api.useUtils();
  const { data: conversation } = api.support.myConversation.useQuery(
    undefined,
    {
      enabled: auth?.role === "member",
      refetchInterval: open ? 4000 : false,
    },
  );
  const { mutateAsync: send, isPending } =
    api.support.sendMemberMessage.useMutation();

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, conversation?.messages.length]);

  if (auth?.role !== "member") return null;

  const submit = async () => {
    const message = body.trim();
    if (!message) return;
    try {
      await send({ body: message });
      setBody("");
      await utils.support.myConversation.invalidate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to send message",
      );
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <Card className="w-[min(390px,calc(100vw-32px))] overflow-hidden shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b p-4">
            <div>
              <CardTitle>Support</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                We usually reply here shortly.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen(false)}
              aria-label="Close support chat"
            >
              <X />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80 bg-muted/20 p-4">
              <div className="flex flex-col gap-3 pr-3">
                {!conversation?.messages.length && (
                  <div className="rounded-lg border border-dashed bg-background p-4 text-center text-sm text-muted-foreground">
                    Tell us what you need help with. Your organization admins
                    will see this conversation.
                  </div>
                )}
                {conversation?.messages.map((message) => {
                  const mine = message.senderRole === "member";
                  return (
                    <div
                      key={message.id}
                      className={
                        mine
                          ? "ml-8 flex justify-end"
                          : "mr-8 flex justify-start"
                      }
                    >
                      <div
                        className={
                          mine
                            ? "rounded-xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                            : "rounded-xl rounded-bl-sm border bg-background px-3 py-2 text-sm"
                        }
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {message.body}
                        </p>
                        <p className="mt-1 text-[11px] opacity-65">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>
            <div className="flex gap-2 border-t p-3">
              <Textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void submit();
                  }
                }}
                placeholder="Write a message…"
                className="min-h-11 max-h-28 resize-none"
              />
              <Button
                size="icon"
                onClick={() => void submit()}
                disabled={!body.trim()}
                isLoading={isPending}
                aria-label="Send message"
              >
                <Send />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Button
        size="icon-lg"
        className="rounded-full shadow-lg"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close support chat" : "Open support chat"}
      >
        {open ? <X /> : <MessageCircle />}
      </Button>
    </div>
  );
}
