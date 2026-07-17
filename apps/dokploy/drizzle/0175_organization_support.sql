ALTER TABLE "organization" ADD COLUMN "custom_css" text;
--> statement-breakpoint
CREATE TABLE "support_conversation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"requester_id" text NOT NULL,
	"subject" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_message" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"sender_role" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "support_conversation" ADD CONSTRAINT "support_conversation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "support_conversation" ADD CONSTRAINT "support_conversation_requester_id_user_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "support_message" ADD CONSTRAINT "support_message_conversation_id_support_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."support_conversation"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "support_message" ADD CONSTRAINT "support_message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "supportConversation_organizationId_idx" ON "support_conversation" USING btree ("organization_id");
--> statement-breakpoint
CREATE INDEX "supportConversation_requesterId_idx" ON "support_conversation" USING btree ("requester_id");
--> statement-breakpoint
CREATE INDEX "supportConversation_updatedAt_idx" ON "support_conversation" USING btree ("updated_at");
--> statement-breakpoint
CREATE INDEX "supportMessage_conversationId_idx" ON "support_message" USING btree ("conversation_id");
--> statement-breakpoint
CREATE INDEX "supportMessage_createdAt_idx" ON "support_message" USING btree ("created_at");
