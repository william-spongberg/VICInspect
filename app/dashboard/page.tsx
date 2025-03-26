"use client";

import { useAuth } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@heroui/button";

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

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <h2 className="text-xl font-semibold mb-4">
        Welcome, {user.user_metadata.name || user.email || "User"}
      </h2>

      <div className="mb-4">
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
        <p>
          <strong>Email:</strong> {user.email ?? "No email provided"}
        </p>
        <p>
          <strong>Provider:</strong> {user.app_metadata.provider ?? "Unknown"}
        </p>
      </div>

      <Button
        onPress={signOut}
        variant="bordered"
        color="danger"
      >
        Sign Out
      </Button>
    </div>
  );
}
