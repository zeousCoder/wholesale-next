"use client";
import React, { useState, useEffect, useTransition } from "react";
import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { updateUserPhone } from "@/actions/userPhoneAction";

export default function ProfileTab() {
  const { data: session } = useSession();
  const [phone, setPhone] = useState(session?.user?.phone || "");
  const [isPending, startTransition] = useTransition();

  // Keep phone state updated if session changes
  useEffect(() => {
    if (session?.user?.phone) {
      setPhone(session.user.phone);
    }
  }, [session?.user?.phone]);

  const handleSavePhone = async () => {
    if (!phone) {
      toast.error("Please enter your mobile number.");
      return;
    }

    startTransition(async () => {
      try {
        const updatedUser = await updateUserPhone(phone);
        toast.success(`Phone number ${updatedUser.phone} saved successfully!`);
        // Optionally update session/user here if needed
      } catch (e: any) {
        toast.error(e.message || "Failed to update phone.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto ">
      <span className="text-xl font-bold border-b pb-2">Profile</span>
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-4 py-6 rounded-2xl shadow-md">
        <Avatar className="w-24 h-24">
          <AvatarImage src={session?.user.image || ""} alt="User Image" />
          <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="h-5 w-5" /> {session?.user.name}
        </h1>
        <p className="">{session?.user.email}</p>
        <p className="">Phone: {session?.user.phone}</p>
        <Badge className="uppercase">{session?.user.role}</Badge>
      </div>

      {/* Mobile Number Input */}
      <div className=" rounded-2xl shadow-md flex flex-col p-4 gap-4">
        <Label htmlFor="phone">Mobile Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full"
        />
        <Button
          onClick={handleSavePhone}
          className="mt-2 w-full"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Number"}
        </Button>
      </div>
    </div>
  );
}
