import { useEffect, useState } from "react";
import { Button, Input, Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import { FaBell, FaBellSlash } from "react-icons/fa";

import {
  subscribeUser,
  unsubscribeUser,
  sendNotification,
} from "@/app/actions";

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
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
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
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
    return (
      <Card className="mt-8">
        <CardBody>
          <p className="text-default-500">Push notifications are not supported in this browser.</p>
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
            {subscription ? "You will be notified when inspectors are reported nearby" : "Subscribe to get alerts when inspectors are reported nearby"}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        {subscription ? (
          <>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-2 items-center mb-2">
                <FaBell className="text-success" />
                <p className="text-success">You are subscribed to push notifications.</p>
              </div>
              
              <div className="flex gap-2 mb-4 max-w-lg flex-col sm:flex-row">
                <Input
                  placeholder="Enter notification message"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button color="success" onPress={sendTestNotification} size="lg">
                  Send Test
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-2 items-center mb-2">
              <FaBellSlash className="text-default-500" />
              <p className="text-default-500">You are not receiving notifications.</p>
            </div>
          </div>
        )}
      </CardBody>
      <CardFooter>
        {subscription ? (
          <Button color="danger" variant="bordered" onPress={unsubscribeFromPush}>
            Unsubscribe
          </Button>
        ) : (
          <Button color="primary" onPress={subscribeToPush}>
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
