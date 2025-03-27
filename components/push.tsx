import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@heroui/react";
import { FaBell, FaBellSlash } from "react-icons/fa";

import { sendNotification } from "@/app/actions";
import { useAuth } from "@/context/auth-context";
import {
  subscribeUser,
  unsubscribeUser,
  DbSubscription,
  getDeviceId,
} from "@/supabase/subscriptions";

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [dbSubscription, setDbSubscription] = useState<DbSubscription | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window && user) {
      setIsSupported(true);
      const id = getDeviceId();

      setDeviceId(id);
      registerServiceWorker();
    }
  }, [user]);

  function convertSubscription(sub: PushSubscription | null) {
    setSubscription(sub);
    if (!sub) return null;
    if (!user) {
      setErrorMessage("User not authenticated. Please log in again.");

      return null;
    }

    const dbSub = {
      user_id: user.id,
      device_id: deviceId,
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
      setErrorMessage("Failed to register service worker");
    }
  }

  // subscribe to push notifications if logged in
  async function subscribeToPush() {
    if (!user) {
      setErrorMessage("Cannot subscribe without being logged in");

      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

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

      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // unsubscribe from push notifications if device ID is available
  async function unsubscribeFromPush() {
    setIsLoading(true);
    try {
      if (deviceId) {
        const result = await unsubscribeUser(deviceId);

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
      setErrorMessage(
        error instanceof Error ? error.message : "Unsubscribe failed",
      );
    } finally {
      setIsLoading(false);
    }
  }

  // send a test notification
  async function sendTestNotification() {
    if (subscription && user) {
      await sendNotification(message, dbSubscription!);
      setMessage("");
    }
  }

  if (!isSupported) {
    return (
      <Card className="mt-8">
        <CardBody>
          <p className="text-default-500">
            Push notifications are not supported in this browser.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold">Push Notifications</h3>
          <p className="text-default-500">
            {subscription
              ? "You will be notified when inspectors are reported nearby"
              : "Subscribe to get alerts when inspectors are reported nearby"}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        {errorMessage && (
          <div className="mb-4 p-3 bg-danger-50 text-danger border border-danger-200 rounded-md">
            <p className="font-semibold">Error:</p>
            <p>{errorMessage}</p>
          </div>
        )}

        {subscription ? (
          <>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-2 items-center mb-2">
                <FaBell className="text-success" />
                <p className="text-success">
                  You are subscribed to push notifications.
                </p>
              </div>

              <div className="flex gap-2 mb-4 max-w-lg flex-col sm:flex-row">
                <Input
                  placeholder="Enter notification message"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                  color="success"
                  size="lg"
                  onPress={sendTestNotification}
                >
                  Send Test
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-2 items-center mb-2">
              <FaBellSlash className="text-default-500" />
              <p className="text-default-500">
                You are not receiving notifications.
              </p>
            </div>
          </div>
        )}
      </CardBody>
      <CardFooter>
        {subscription ? (
          <Button
            color="danger"
            isLoading={isLoading}
            variant="bordered"
            onPress={unsubscribeFromPush}
          >
            Unsubscribe
          </Button>
        ) : (
          <Button
            color="primary"
            isDisabled={!user}
            isLoading={isLoading}
            onPress={subscribeToPush}
          >
            Subscribe
          </Button>
        )}
      </CardFooter>
    </Card>
  );
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
