"use client";

import type { Provider } from "@supabase/auth-js";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Divider } from "@heroui/react";

import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/auth-context";

import { title, subtitle } from "@/components/primitives";

export default function SignInPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if user is already logged in
  if (user) {
    router.push("/dashboard");

    return null;
  }

  const handleSignIn = async (platform: Provider) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: platform,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    await handleSignIn("github");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h1 className={title({ color: "blue" })}>Sign In</h1>
          <p className={subtitle()}>
            Sign in or create a new account to use all features
          </p>
        </CardHeader>
        <Divider />
        <CardBody>
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <Button
            className="w-full flex items-center justify-center gap-2 py-6"
            color="default"
            disabled={isLoading}
            size="lg"
            variant="bordered"
            onPress={handleGitHubSignIn}
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                Sign in with GitHub
              </>
            )}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
