"use client";

import React, { useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { RiLoader2Fill } from "react-icons/ri";
import { signIn } from "@/lib/auth-client";
import { Button } from "../ui/button";

const providerDetails = {
  google: {
    name: "Google",
    icon: FaGoogle,
  },
  github: {
    name: "Github",
    icon: FaGithub,
  },
};

interface SignInButtonProps {
  provider: "google" | "github";
  signUp?: boolean;
}

export default function SignInButton({ provider, signUp }: SignInButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const { name: providerName, icon: Icon } = providerDetails[provider];

  const handleClick = async () => {
    setIsPending(true);

    await signIn.social({
      provider,
      callbackURL: "/",
      errorCallbackURL: "/",
    });

    setIsPending(false);
  };

  const actionText = signUp ? "Up" : "In";

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className=" flex items-center justify-center gap-2"
    >
      {isPending ? (
        <RiLoader2Fill className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      <span>Sign in</span>
    </Button>
  );
}
