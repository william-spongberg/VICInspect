"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import type { Provider } from "@supabase/auth-js";
import { useAuth } from "../../context/auth-context";
import { Button } from "@heroui/button";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-8  rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="mt-2 ">Sign in or create a new account</p>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Button
            onPress={handleGitHubSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                Sign in with GitHub
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
