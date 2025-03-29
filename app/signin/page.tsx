"use client";

import type { Provider } from "@supabase/auth-js";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  addToast,
} from "@heroui/react";

import { supabase } from "@/supabase/client";
import { useAuth } from "@/context/auth-context";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function SignInPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState<string>("");

  // Redirect if user is already logged in
  if (user) {
    router.push("/dashboard");

    return null;
  }

  const handleSignIn = async (platform: Provider) => {
    try {
      setError("");

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: platform,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message);
        throw authError;
      }
    } catch (e: any) {
      showErrorToast("Sign In Error", error);
    }
  };

  const handleGitHubSignIn = async () => {
    await handleSignIn("github");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader className="flex flex-col gap-2 items-center py-6">
            <h1 className={title({ color: "blue" })}>Sign In</h1>
            <p className={`${subtitle()} text-center`}>
              Sign in or create a new account to use all features
            </p>
          </CardHeader>
          <Divider />
          <CardBody className="py-6 px-5">
            <Button
              className="w-full flex items-center justify-center gap-2 py-6"
              color="default"
              size="lg"
              startContent={<GithubIcon size={24} />}
              variant="shadow"
              onPress={handleGitHubSignIn}
            >
              Sign in with GitHub
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
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
