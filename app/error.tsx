"use client";

import { useEffect } from "react";
import { Button } from "@heroui/react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <p className="text-red-500">
        {error.name}
        {": "}
        {error.message}
      </p>
      <Button
        color="primary"
        onPress={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
