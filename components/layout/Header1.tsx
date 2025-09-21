"use client";

import { usePathname } from "next/navigation";
import React from "react";
import ThemeToggle from "./ThemeToggle";
import LoginSystem from "./LoginSystem";

import Link from "next/link";
import { motion } from "framer-motion";
import WishlistSheet from "./WishlistSheet";
import { useSession } from "@/lib/auth-client";
import CartSheet from "./CartSheet";

export default function Header1() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const { data: session } = useSession();
  const user = session?.user?.id;

  if (isDashboard) return null;

  return (
    <header className="w-full flex justify-center items-center px-4 mx-auto h-16 sticky top-3 z-50">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className=" w-full flex items-center justify-between px-4 h-full 
          rounded-2xl shadow-2xl border border-black/20 dark:border-white/20
          backdrop-blur-xl bg-background/70
          transition-all duration-300"
      >
        {/* Brand */}
        <Link href={"/"}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-row items-center gap-3 cursor-pointer"
          >
            <span
              className="flex items-center justify-center w-12 h-12 rounded-full 
              dark:bg-white bg-black
              text-white dark:text-black font-bold shadow-md"
            >
              W-M
            </span>
            <h1 className="text-lg lg:block hidden font-semibold dark:text-white text-black drop-shadow-sm">
              Wholesale Market
            </h1>
          </motion.div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <CartSheet userId={user ?? ""} />
          <WishlistSheet userId={user ?? ""} />
          <ThemeToggle />
          <LoginSystem />
        </div>
      </motion.div>
    </header>
  );
}
