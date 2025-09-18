"use client";

import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

// Footer sections
const footerLinks = [
  {
    group: "Quick Links",
    items: [
      { title: "Feedback", href: "/feedback" },
      { title: "FAQ", href: "/faq" },
    ],
  },
  {
    group: "Support",
    items: [
      { title: "Help Center", href: "/help-center" },
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Terms & Condition", href: "/terms-and-condition" },
    ],
  },
  {
    group: "Company",
    items: [
      { title: "About Us", href: "/about" },
      { title: "Contact", href: "/contact" },
    ],
  },
];

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "YouTube", href: "#", icon: Youtube },
];

export default function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  if (isDashboard) return null;

  return (
    <footer className=" border-t ">
      <div className="mx-auto px-4 pt-5 ">
        {/* Top Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Logo + Newsletter */}
          <div className="md:col-span-2 space-y-6">
            {/* Logo */}
            <Link href="/" aria-label="go home" className="block">
              <div className="flex items-center gap-3 cursor-pointer">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold shadow-md">
                  M
                </span>
                <h1 className="text-lg font-semibold dark:text-white text-black">
                  Wholesale Market
                </h1>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your one-stop marketplace to connect with wholesalers and explore
              the best deals across industries.
            </p>

            {/* Newsletter */}
            <form className="space-y-3  w-full">
              <Label htmlFor="newsletter" className="text-sm font-medium">
                Subscribe to our Newsletter
              </Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  id="newsletter"
                  placeholder="Enter your email"
                  className="h-9 text-sm"
                />
                <Button size="sm">Subscribe</Button>
              </div>
              <span className="text-xs text-muted-foreground block">
                Stay updated with the latest offers & news.
              </span>
            </form>
          </div>

          {/* Link Groups */}
          <div className="md:col-span-3 grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerLinks.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <span className="block font-semibold text-sm">
                  {section.group}
                </span>
                <ul className="space-y-2 text-sm">
                  {section.items.map((item, i) => (
                    <li key={i}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <Separator className="my-4" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center pb-5 justify-between gap-6">
          <small className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Wholesale Market. All rights reserved.
          </small>
          <div className="flex gap-5">
            {socialLinks.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                href={href}
                aria-label={name}
                className="text-muted-foreground hover:text-primary transition"
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
