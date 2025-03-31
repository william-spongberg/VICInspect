"use client";
import { Link } from "@heroui/react";

export default function Footer() {
  return (
    <footer className="w-full mx-auto pt-8 pb-4 py-4 px-4">
      <div className="text-center">
        <div className="w-full flex items-center justify-center pb-4">
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
            href="https://github.com/william-spongberg"
            title="website author"
          >
            <span className="text-gray-600 text-sm">Created by</span>
            <p className="text-primary text-sm">William Spongberg</p>
          </Link>
        </div>
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} PTV Inspector Tracker. All rights
          reserved.
        </p>

        <p className="text-sm text-muted-foreground">
          <Link className="text-sm hover:underline" href="/privacy">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link className="text-sm hover:underline" href="/terms">
            Terms of Service
          </Link>{" "}
          |{" "}
          <Link
            className="text-sm hover:underline"
            href="mailto:william@spongberg.dev"
          >
            Contact Us
          </Link>
        </p>
      </div>
    </footer>
  );
}
