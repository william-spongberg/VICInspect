"use server";

import { DbSubscription } from "@/supabase/subscriptions";

const webpush = require("web-push");

// DEV: generate VAPID keys using web-push library first
webpush.setVapidDetails(
  "mailto:william@spongberg.dev",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

// send a notification to the endpoint
export async function sendNotification(message: string, sub: DbSubscription) {
  const subscription = {
    endpoint: sub.endpoint,
    keys: sub.keys,
  };

  await webpush.sendNotification(
    subscription,
    JSON.stringify({
      title: "Inspector Nearby",
      body: message,
      icon: "/icon.png",
    }),
  );
}
