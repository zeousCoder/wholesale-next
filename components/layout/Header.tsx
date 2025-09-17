"use client";

import { usePathname } from "next/navigation";
import React from "react";
import ThemeToggle from "./ThemeToggle";
import LoginSystem from "./LoginSystem";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { motion } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/categories" },
];

export default function Header() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) return null;

  return (
    <header className="w-full flex justify-center items-center px-4 mx-auto h-16 sticky top-3 z-50">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="container w-full flex items-center justify-between px-4 h-full 
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
              className="flex items-center justify-center w-10 h-10 rounded-full 
              bg-gradient-to-br from-indigo-600 via-purple-500 to-cyan-400 
              text-white font-bold shadow-md"
            >
              M
            </span>
            <h1 className="text-xl font-semibold tracking-wide dark:text-white text-black drop-shadow-sm">
              Wholesale Market
            </h1>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${
                      isActive
                        ? "bg-white/50 dark:bg-white/10 font-semibold shadow-inner backdrop-blur-xl border border-white/40"
                        : "text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-cyan-300 hover:bg-white/10 dark:hover:bg-white/5"
                    }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex gap-3">
          <div className="lg:flex hidden gap-3 items-center">
            <LoginSystem />
            <ThemeToggle />
          </div>
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex flex-col bg-background/90 backdrop-blur-2xl p-6"
            >
              <SheetHeader>
                <SheetTitle>
                  <Link href={"/"}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-row items-center gap-3"
                    >
                      <span
                        className="flex items-center justify-center w-10 h-10 rounded-full 
                        bg-gradient-to-br from-indigo-600 via-purple-500 to-cyan-400 
                        text-white font-bold shadow-md"
                      >
                        M
                      </span>
                      <h1 className="text-xl font-semibold tracking-wide dark:text-white text-black drop-shadow-sm">
                        Wholesale Market
                      </h1>
                    </motion.div>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <Separator className="dark:bg-white/20 bg-black/20 my-4" />

              {/* Mobile Navigation Links */}
              <motion.nav
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="flex flex-col gap-3 flex-1"
              >
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        show: { opacity: 1, x: 0 },
                      }}
                    >
                      <Link
                        href={link.href}
                        className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300
                          ${
                            isActive
                              ? "bg-white/30 dark:bg-white/10 text-indigo-600 dark:text-cyan-400 font-semibold shadow-inner backdrop-blur-md border border-white/20"
                              : "text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-cyan-300 hover:bg-white/10 dark:hover:bg-white/5"
                          }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>

              {/* Controls pushed to the bottom */}
              <div className="mt-auto">
                <Separator className="dark:bg-white/20 bg-black/20 my-4" />
                <div className="flex justify-between items-center gap-3">
                  <LoginSystem />
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>
    </header>
  );
}
