import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Single source of truth for User creation. The app never creates a User
// row lazily inside a request handler — only this webhook does, which
// avoids race conditions between sign-up and first authenticated request.
export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await req.text();

  const wh = new Webhook(webhookSecret);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Clerk webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const { id, email_addresses, first_name, last_name } = event.data;
      const primaryEmail = email_addresses?.[0]?.email_address;

      if (!primaryEmail) {
        return new Response("No email on Clerk user", { status: 400 });
      }

      await prisma.user.upsert({
        where: { clerkUserId: id },
        update: {
          email: primaryEmail,
          name: [first_name, last_name].filter(Boolean).join(" ") || null,
        },
        create: {
          clerkUserId: id,
          email: primaryEmail,
          name: [first_name, last_name].filter(Boolean).join(" ") || null,
        },
      });
      break;
    }

    case "user.deleted": {
      const { id } = event.data;
      if (id) {
        await prisma.user.deleteMany({ where: { clerkUserId: id } });
      }
      break;
    }

    default:
      // Ignore event types not relevant to Sprint 1
      break;
  }

  return new Response("OK", { status: 200 });
}