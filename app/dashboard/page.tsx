"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Divider,
} from "@heroui/react";

import { useAuth } from "../../context/auth-context";

import PushNotificationManager from "@/components/push";

export default function Dashboard() {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();

  // redirects to signin page if no user
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [user, isLoading, router]);

  // if no user, force refresh useEffect
  if (!user) {
    return null;
  }

  const userInitial = (user.user_metadata.name || user.email || "User")
    .charAt(0)
    .toUpperCase();
  const userName = user.user_metadata.name || user.email || "User";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <Card className="mb-6">
        <CardHeader className="flex items-center gap-4">
          <Avatar color="primary" name={userInitial} size="lg" />
          <div>
            <h2 className="text-xl font-semibold">Welcome, {userName}</h2>
            <p className="text-default-500">Account Information</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-3">
            <p>
              <strong>User ID:</strong> {user.id}
            </p>
            <p>
              <strong>Email:</strong> {user.email ?? "No email provided"}
            </p>
            <p>
              <strong>Provider:</strong>{" "}
              {user.app_metadata.provider ?? "Unknown"}
            </p>
          </div>
        </CardBody>
        <CardFooter>
          <Button color="danger" variant="bordered" onPress={signOut}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>

      <PushNotificationManager />
    </div>
  );
}
