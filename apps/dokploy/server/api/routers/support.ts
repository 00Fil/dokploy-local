import { db } from "@dokploy/server/db";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { supportConversation, supportMessage } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const messageInput = z.string().trim().min(1).max(5000);

const assertMember = (role: string) => {
  if (role !== "member") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "La chat di assistenza è disponibile per i membri",
    });
  }
};

const assertAdmin = (role: string) => {
  if (role !== "owner" && role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message:
        "Solo gli amministratori dell’organizzazione possono gestire l’assistenza",
    });
  }
};

export const supportRouter = createTRPCRouter({
  myConversation: protectedProcedure.query(async ({ ctx }) => {
    assertMember(ctx.user.role);
    return db.query.supportConversation.findFirst({
      where: and(
        eq(
          supportConversation.organizationId,
          ctx.session.activeOrganizationId,
        ),
        eq(supportConversation.requesterId, ctx.user.id),
        ne(supportConversation.status, "closed"),
      ),
      with: {
        messages: {
          orderBy: [asc(supportMessage.createdAt)],
          with: { sender: true },
        },
      },
      orderBy: [desc(supportConversation.updatedAt)],
    });
  }),

  sendMemberMessage: protectedProcedure
    .input(z.object({ body: messageInput }))
    .mutation(async ({ ctx, input }) => {
      assertMember(ctx.user.role);
      const organizationId = ctx.session.activeOrganizationId;
      let conversation = await db.query.supportConversation.findFirst({
        where: and(
          eq(supportConversation.organizationId, organizationId),
          eq(supportConversation.requesterId, ctx.user.id),
          ne(supportConversation.status, "closed"),
        ),
        orderBy: [desc(supportConversation.updatedAt)],
      });

      if (!conversation) {
        conversation = await db
          .insert(supportConversation)
          .values({
            organizationId,
            requesterId: ctx.user.id,
            subject: input.body.slice(0, 80),
          })
          .returning()
          .then((rows) => rows[0]);
      }
      if (!conversation) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      await db.insert(supportMessage).values({
        conversationId: conversation.id,
        senderId: ctx.user.id,
        senderRole: "member",
        body: input.body,
      });
      await db
        .update(supportConversation)
        .set({ status: "open", updatedAt: new Date() })
        .where(eq(supportConversation.id, conversation.id));
      return { conversationId: conversation.id };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    assertAdmin(ctx.user.role);
    return db.query.supportConversation.findMany({
      where: eq(
        supportConversation.organizationId,
        ctx.session.activeOrganizationId,
      ),
      with: {
        requester: true,
        messages: {
          orderBy: [desc(supportMessage.createdAt)],
          limit: 1,
        },
      },
      orderBy: [desc(supportConversation.updatedAt)],
    });
  }),

  conversation: protectedProcedure
    .input(z.object({ conversationId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      assertAdmin(ctx.user.role);
      const conversation = await db.query.supportConversation.findFirst({
        where: and(
          eq(supportConversation.id, input.conversationId),
          eq(
            supportConversation.organizationId,
            ctx.session.activeOrganizationId,
          ),
        ),
        with: {
          requester: true,
          messages: {
            orderBy: [asc(supportMessage.createdAt)],
            with: { sender: true },
          },
        },
      });
      if (!conversation) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return conversation;
    }),

  reply: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().min(1),
        body: messageInput,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      assertAdmin(ctx.user.role);
      const conversation = await db.query.supportConversation.findFirst({
        where: and(
          eq(supportConversation.id, input.conversationId),
          eq(
            supportConversation.organizationId,
            ctx.session.activeOrganizationId,
          ),
        ),
      });
      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });
      await db.insert(supportMessage).values({
        conversationId: conversation.id,
        senderId: ctx.user.id,
        senderRole: "admin",
        body: input.body,
      });
      await db
        .update(supportConversation)
        .set({ status: "pending", updatedAt: new Date() })
        .where(eq(supportConversation.id, conversation.id));
      return true;
    }),

  setStatus: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().min(1),
        status: z.enum(["open", "pending", "closed"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      assertAdmin(ctx.user.role);
      const result = await db
        .update(supportConversation)
        .set({ status: input.status, updatedAt: new Date() })
        .where(
          and(
            eq(supportConversation.id, input.conversationId),
            eq(
              supportConversation.organizationId,
              ctx.session.activeOrganizationId,
            ),
          ),
        )
        .returning({ id: supportConversation.id });
      if (!result[0]) throw new TRPCError({ code: "NOT_FOUND" });
      return true;
    }),
});
