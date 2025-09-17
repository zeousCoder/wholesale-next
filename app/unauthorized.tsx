"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ShieldAlert, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";

export default function Unauthorized() {
  const [isPending, setIsPending] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("/");
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  // Capture the page user tried to access
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname + window.location.search;
      setRedirectUrl(currentPath);

      // Check if it's the dashboard route
      if (window.location.pathname.startsWith("/dashboard")) {
        setIsAdminRoute(true);
      }
    }
  }, []);

  const handleLogin = async () => {
    try {
      setIsPending(true);

      await signIn.social({
        provider: "google",
        callbackURL: redirectUrl, // redirect back where they came from
        errorCallbackURL: "/unauthorized",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="flex flex-col items-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold">
            Unauthorized Access
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            {isAdminRoute
              ? "You must be an admin to access this page."
              : "You need to be logged in to continue. Please sign in with your account to access this page."}
          </CardDescription>
        </CardHeader>
        {!isAdminRoute && (
          <CardContent>
            <Button
              onClick={handleLogin}
              disabled={isPending}
              className="w-full"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting...
                </span>
              ) : (
                "Login with Google"
              )}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
