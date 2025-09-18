"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SignInButton from "./SignInButton";
import { useSession, signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  CreditCard,
  Users,
  Package,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginSystem() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return <Skeleton className="h-10 w-10 rounded-full animate-pulse" />;
  }

  if (!session) {
    return <SignInButton provider="google" />;
  }

  // Define menu items with routes
  const menuItems = [
    { label: "Profile", icon: User, href: "/profile?tab=profile" },
    { label: "Address", icon: CreditCard, href: "/profile?tab=address" },
    { label: "Cart", icon: Users, href: "/profile?tab=cart" },
    { label: "Wishlist", icon: Package, href: "/profile?tab=wishlist" },
  ];

  // If user is admin → add dashboard at top
  if (session?.user?.role === "ADMIN") {
    menuItems.unshift({
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    });
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully 🚀");
      router.push("/"); // redirect home
    } catch (error) {
      toast.error("Something went wrong while signing out");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-10 w-10 border border-gray-200 shadow-sm hover:shadow-md transition">
            <AvatarImage src={session?.user?.image || ""} alt="user_img" />
            <AvatarFallback>
              {session?.user?.name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-xl shadow-lg p-1"
          align="end"
        >
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-medium">
                {session?.user?.name ?? "User"}
              </span>
              <span className="text-xs text-muted-foreground">
                {session?.user?.email ?? ""}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Render items dynamically */}
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              asChild
              className="flex items-center gap-2 cursor-pointer"
            >
              <Link href={item.href} className="flex items-center gap-2 w-full">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="flex items-center gap-2 text-red-500 focus:text-red-600 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
