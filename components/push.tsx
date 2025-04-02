import { useEffect, useState } from "react";
import { Button, Card, addToast } from "@heroui/react";
import { FaBell, FaBellSlash } from "react-icons/fa";

import { sendNotification } from "@/app/actions";
import { useAuth } from "@/context/auth-context";
import { subtitle } from "@/components/primitives";
import {
  subscribeUser,
  unsubscribeUser,
  DbSubscription,
  getSubscriptionId,
} from "@/supabase/subscriptions";

const testMessage = "This is a test";

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [dbSubscription, setDbSubscription] = useState<DbSubscription | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window && user) {
      setIsSupported(true);
      setSubscriptionId(getSubscriptionId(user.id));
      registerServiceWorker();
    }
  }, [user]);

  function convertSubscription(sub: PushSubscription | null) {
    setSubscription(sub);
    if (!sub) return null;
    if (!user) {
      showErrorToast("Error", "User not authenticated. Please log in again.");

      return null;
    }

    const dbSub = {
      user_id: user.id,
      device_id: subscriptionId,
      endpoint: sub.endpoint,
      keys: {
        p256dh: Buffer.from(sub.getKey("p256dh") as ArrayBuffer).toString(
          "base64",
        ),
        auth: Buffer.from(sub.getKey("auth") as ArrayBuffer).toString("base64"),
      },
    } as DbSubscription;

    setDbSubscription(dbSub);

    return dbSub;
  }

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      const sub = await registration.pushManager.getSubscription();

      convertSubscription(sub);
    } catch (error) {
      showErrorToast("Error", "Failed to register service worker");
    }
  }

  // subscribe to push notifications if logged in
  async function subscribeToPush() {
    if (!user) {
      showErrorToast("Error", "Cannot subscribe without being logged in");

      return;
    }

    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });

      const dbSub = convertSubscription(sub);

      if (dbSub) {
        const result = await subscribeUser(dbSub);

        if (!result.success) {
          throw new Error(result.error ?? "Failed to subscribe");
        }
      } else {
        throw new Error("Failed to create subscription data");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Subscription failed";

      showErrorToast("Subscribe Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // unsubscribe from push notifications if device ID is available
  async function unsubscribeFromPush() {
    setIsLoading(true);
    try {
      if (subscriptionId) {
        const result = await unsubscribeUser(subscriptionId);

        if (result.success) {
          if (subscription) {
            await subscription.unsubscribe();
            setSubscription(null);
          }
        } else {
          throw new Error(result.error ?? "Failed to unsubscribe");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unsubscription failed";

      showErrorToast("Unsubscribe Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // send a test notification
  async function sendTestNotification() {
    if (subscription && user) {
      await sendNotification(testMessage, dbSubscription!);
    }
  }

  if (!isSupported) {
    return (
      <div className="bg-default-50 p-4 rounded-medium border border-default-200 shadow-sm">
        <p className={subtitle({ fullWidth: true, class: "!my-0 !text-sm" })}>
          Push notifications are not supported in this browser.
        </p>
      </div>
    );
  }

  return (
    <Card className="p-4 rounded-medium shadow-none">
      <div className="text-sm text-default-500">
        This feature is currently still under development, so only test
        notifications are available for now. Please check back later for
        updates.
      </div>
      {subscription ? (
        <div className="rounded-medium">
          <div className="flex flex-col items-start gap-2 mb-2">
            <div className="flex flex-row items-center gap-2">
              <Button
                className="mt-2 w-full sm:w-auto"
                color="primary"
                size="md"
                onPress={sendTestNotification}
              >
                Send Notification
              </Button>
              <Button
                className="mt-2 w-full sm:w-auto"
                color="danger"
                isLoading={isLoading}
                size="md"
                startContent={!isLoading && <FaBellSlash />}
                variant="ghost"
                onPress={unsubscribeFromPush}
              >
                Unsubscribe
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-medium">
          <div className="flex flex-col items-start gap-2 mb-2">
            <Button
              color="primary"
              isDisabled={!user}
              isLoading={isLoading}
              size="md"
              startContent={!isLoading && <FaBell />}
              onPress={subscribeToPush}
            >
              Subscribe to Notifications
            </Button>
          </div>
          {/* <p className={subtitle({ fullWidth: true, class: "!my-0 !text-sm" })}>
            Subscribe to get alerts when inspectors are reported nearby
          </p> */}
        </div>
      )}
    </Card>
  );
}

function showErrorToast(title: string, message: string) {
  addToast({
    title: title,
    description: message,
    color: "danger",
    timeout: 5000,
  });
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
