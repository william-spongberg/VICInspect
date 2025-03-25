import { useEffect, useState } from "react";
import {
  subscribeUser,
  unsubscribeUser,
  sendNotification,
} from "@/app/actions";
import { Button, Input } from "@heroui/react";

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();

    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });

    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));

    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message);
      setMessage("");
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div className="p-4 pt-8 rounded shadow-md">
      <h3 className="text-xl font-semibold mt-4 mb-4">Push Notifications</h3>
      {subscription ? (
        <>
          <p className="mb-2 text-gray-700">
            You are subscribed to push notifications.
          </p>
          
          <div className="flex gap-2 mb-4 max-w-lg">
            <Input
              placeholder="Enter notification message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button color="success" onPress={sendTestNotification}>
              Send Test
            </Button>
          </div>

          <Button className="mb-2" color="danger" onPress={unsubscribeFromPush}>
            Unsubscribe
          </Button>
        </>
      ) : (
        <>
          <p className="mb-2 text-gray-700">
            You are not subscribed to push notifications.
          </p>
          <Button color="primary" onPress={subscribeToPush}>
            Subscribe
          </Button>
        </>
      )}
    </div>
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
