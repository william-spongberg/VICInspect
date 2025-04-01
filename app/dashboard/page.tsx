"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Divider,
  Chip,
  Skeleton,
} from "@heroui/react";
import { FcGoogle } from "react-icons/fc";

import { useAuth } from "../../context/auth-context";

import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import PushNotificationManager from "@/components/push";

export default function Dashboard() {
  const { user, avatar, signOut, isLoading } = useAuth();
  const router = useRouter();

  // redirects to signin page if no user
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [user, avatar, isLoading, router]);

  if (!user && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader className="flex flex-col gap-2 items-center py-6">
            <Skeleton className="h-8 w-40 rounded-lg mb-2" />
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-8 w-40 rounded-lg mb-2" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 pt-20 px-4">
        <Card className="mb-6 shadow-md">
          <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
            <Skeleton className="rounded-full w-14 h-14" />
            <div className="flex-grow text-center sm:text-left">
              <Skeleton className="h-8 w-40 rounded-lg mb-2 mx-auto sm:mx-0" />
              <Skeleton className="h-4 w-60 rounded-lg mx-auto sm:mx-0" />
            </div>
            <Skeleton className="h-10 w-24 rounded-lg mt-2 sm:mt-0" />
          </CardHeader>

          <Divider />

          <CardBody className="py-6 px-3 sm:px-5">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-48 rounded-lg mb-4" />
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <Skeleton className="h-6 w-28 rounded-lg" />
                    <Skeleton className="h-8 w-full sm:w-40 rounded-lg" />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <Skeleton className="h-6 w-28 rounded-lg" />
                    <Skeleton className="h-8 w-full sm:w-64 rounded-lg" />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <Skeleton className="h-6 w-28 rounded-lg" />
                    <Skeleton className="h-8 w-10 rounded-lg" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-8 w-36 rounded-lg mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-10 w-full sm:w-48 rounded-lg" />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // if no user, force refresh useEffect
  if (!user) {
    return null;
  }
  const userName = user.user_metadata.name ?? "User";
  const provider = user.app_metadata.provider ?? "Unknown";

  function getProviderIcon() {
    switch (provider.toLowerCase()) {
      case "github":
        return <GithubIcon size={25} />;
      case "google":
        return <FcGoogle size={25} />;
      default:
        return null;
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pt-20 px-4">
      <Card className="mb-6 shadow-md">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar color="secondary" size="lg" src={avatar ?? ""} />
          <div className="flex-grow text-center sm:text-left">
            <h2
              className={title({
                color: "cyan",
                size: "sm",
              })}
            >
              {userName}
            </h2>
            <p className="text-sm text-default-500">
              Last login:{" "}
              <span className="font-medium">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : "No sign-in time available"}
              </span>
            </p>
          </div>
          <Button color="danger" variant="light" onPress={signOut} className="mt-2 sm:mt-0">
            Sign Out
          </Button>
        </CardHeader>

        <Divider />

        <CardBody className="py-6 px-3 sm:px-5">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <h3
                className={subtitle({
                  fullWidth: true,
                  class: "!my-3 !text-xl font-semibold text-center sm:text-left",
                })}
              >
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <span className="font-medium text-base w-28">User ID:</span>
                  <Chip size="lg" variant="flat" className="w-full sm:w-auto overflow-hidden">
                    <span className="truncate">{user.id}</span>
                  </Chip>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <span className="font-medium text-base w-28">Email:</span>
                  <Chip color="primary" size="lg" variant="flat" className="w-full sm:w-auto overflow-hidden">
                    <span className="truncate">{user.email ?? "No email provided"}</span>
                  </Chip>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <span className="font-medium text-base w-28">Provider:</span>
                  {getProviderIcon()}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3
                className={subtitle({
                  fullWidth: true,
                  class: "!my-3 !text-xl font-semibold text-center sm:text-left",
                })}
              >
                Notifications
              </h3>
              <PushNotificationManager />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
