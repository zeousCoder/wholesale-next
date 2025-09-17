"use client";
import { cn } from "@/lib/utils";
import {
  ChevronsUpDown,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import { Button } from "../ui/button";

// Static sections
const staticLinks = [
  {
    group: "Qucik Links",
    items: [
      { title: "Features", href: "#" },
      { title: "Solution", href: "#" },
      { title: "Customers", href: "#" },
      { title: "Pricing", href: "#" },
      { title: "Help", href: "#" },
      { title: "About", href: "#" },
    ],
  },
  {
    group: "Support Center",
    items: [
      { title: "Licence", href: "#" },
      { title: "Privacy", href: "#" },
      { title: "Cookies", href: "#" },
      { title: "Security", href: "#" },
    ],
  },
];

// Social icons with lucide
const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "YouTube", href: "#", icon: Youtube },
];

export default function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  if (isDashboard) return null;

  // DB-driven state
  const [categories, setCategories] = useState<
    { title: string; href: string }[]
  >([]);
  const [quickLinks, setQuickLinks] = useState<
    { title: string; href: string }[]
  >([]);

  useEffect(() => {
    // Simulated fetch from DB — replace with your API call
    async function fetchData() {
      const res = await fetch("/api/footer-data");
      const data = await res.json();

      setCategories(data.categories || []);
      setQuickLinks(data.quickLinks || []);
    }
    fetchData();
  }, []);

  return (
    <footer className="border-b  pt-20">
      {/* Top Section */}
      <div className="mb-8 border-b md:mb-12">
        <div className="mx-auto flex w-full container flex-wrap items-end justify-between gap-6 px-4 pb-6">
          {/* Logo */}
          <Link href="/" aria-label="go home" className="block size-fit">
            <div className="flex flex-row items-center gap-3 cursor-pointer">
              <span
                className="flex items-center justify-center w-10 h-10 rounded-full 
                bg-gradient-to-br from-indigo-600 via-purple-500 to-cyan-400 
                text-white font-bold shadow-md"
              >
                M
              </span>
              <h1 className="text-lg font-semibold dark:text-white text-black drop-shadow-sm">
                Wholesale Market
              </h1>
            </div>
          </Link>

          {/* Social Icons */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {socialLinks.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="text-muted-foreground hover:text-primary block transition"
              >
                <Icon className="size-6" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="mx-auto w-full container px-4">
        <div className="grid gap-12 md:grid-cols-5 md:gap-0 lg:grid-cols-4">
          {/* Links */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:col-span-5 md:row-start-1 lg:col-span-3">
            {/* Static */}
            {staticLinks.map((link, index) => (
              <div key={index} className="space-y-4 text-sm">
                <span className="block font-medium">{link.group}</span>
                {link.items.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary block duration-150"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            ))}

            {/* Dynamic Categories */}
            <div className="space-y-4 text-sm">
              <span className="block font-medium">Products</span>
              {categories.length > 0 ? (
                categories.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary block duration-150"
                  >
                    {item.title}
                  </Link>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">Loading...</p>
              )}
            </div>

            {/* Dynamic Quick Links */}
            <div className="space-y-4 text-sm">
              <span className="block font-medium">Categories</span>
              {quickLinks.length > 0 ? (
                quickLinks.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary block duration-150"
                  >
                    {item.title}
                  </Link>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">Loading...</p>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <form className="row-start-1 border-b pb-8 text-sm md:col-span-2 md:border-none lg:col-span-1">
            <div className="space-y-4">
              <Label htmlFor="mail" className="block font-medium">
                Newsletter
              </Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  id="mail"
                  name="mail"
                  placeholder="Your email"
                  className="h-8 text-sm"
                />
                <Button size="sm">Submit</Button>
              </div>
              <span className="text-muted-foreground block text-sm">
                Don't miss any update!
              </span>
            </div>
          </form>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
          <small className="text-muted-foreground order-last block text-center text-sm md:order-first">
            © {new Date().getFullYear()} Wholesale Market, All rights reserved
          </small>
        </div>
      </div>
    </footer>
  );
}
