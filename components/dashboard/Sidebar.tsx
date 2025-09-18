"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Settings,
  User,
  Mail,
  LogOut,
  Menu,
  LogOutIcon,
  Contact,
  ChartArea,
  Projector,
  Paperclip,
  LogsIcon,
  LogIn,
  Image,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Link from "next/link";
import UserDetailsTab from "./UserDetailsTab";
import { FaAddressBook } from "react-icons/fa";
import AddressTab from "./AddressTab";
import LoginDetailsTab from "./LoginDetailsTab";
import BannerTab from "./BannerTab";

export default function SidebarDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleClick() {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("You’ve logged out. See you soon!");
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  const tabsData = [
    {
      value: "home",
      label: "Stats",
      icon: <ChartArea className="w-4 h-4" />,
      content: <div>stats</div>,
    },
    {
      value: "user",
      label: "user",
      icon: <User className="w-4 h-4" />,
      content: <UserDetailsTab />,
    },
    {
      value: "address",
      label: "address",
      icon: <FaAddressBook className="w-4 h-4" />,
      content: <AddressTab />,
    },
    {
      value: "login-details",
      label: "Login Details",
      icon: <LogIn className="w-4 h-4" />,
      content: <LoginDetailsTab />,
    },
    {
      value: "banner",
      label: "Manage Banners",
      icon: <Image className="w-4 h-4" />,
      content: <BannerTab />,
    },
  ];

  const SidebarContent = ({ onTabChange }: { onTabChange?: () => void }) => (
    <>
      {/* Header */}
      <div className="p-4 border-b bg-background/95 backdrop-blur flex justify-between">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold truncate">Dashboard</h1>
        </div>
        <Link href={"/"}>
          <Button>Home</Button>
        </Link>
      </div>

      {/* Tabs List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20">
        <TabsList className="flex flex-col gap-3 h-auto w-full bg-transparent p-2 space-y-1">
          {tabsData.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={onTabChange}
              className="w-full justify-start gap-2 px-3 sm:px-4 py-2 sm:py-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted transition-colors"
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* User Profile & Logout */}
      <div className="p-4 border-t bg-background/95 flex gap-1">
        <Avatar className="h-8 w-8 ">
          <AvatarImage src={session?.user.image || ""} alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium truncate">{session?.user.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {session?.user.email}
          </p>
        </div>
        <ThemeToggle />
        <Button
          onClick={handleClick}
          disabled={isPending}
          variant={"destructive"}
        >
          <LogOutIcon />
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Tabs
        defaultValue="home"
        orientation="vertical"
        className="flex w-full flex-row h-full"
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background w-full absolute top-0 z-50">
          <h1 className="text-lg font-bold">Dashboard</h1>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <div className="flex flex-col h-full">
                <SidebarContent
                  onTabChange={() => setIsMobileMenuOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-60 border-r-2 bg-muted/30 flex-col h-full">
          <SidebarContent />
        </aside>

        {/* Content Area */}
        <section className="flex-1 overflow-auto bg-background pt-16 lg:pt-0">
          {tabsData.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="m-0 h-full"
            >
              <div className="h-full overflow-auto">{tab.content}</div>
            </TabsContent>
          ))}
        </section>
      </Tabs>
    </div>
  );
}
