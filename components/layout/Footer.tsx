"use client";

import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { useNewsletter } from "@/hooks/useNewsletter";
import { useCategories } from "@/hooks/useCategories";

// Footer sections
const footerLinks = [
  {
    group: "Quick Links",
    items: [{ title: "FAQ", href: "/faq" }],
  },
  {
    group: "Support",
    items: [
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

  const { categories } = useCategories();

  const [email, setEmail] = useState("");
  const { subscribe, isSubscribing } = useNewsletter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribe(email);
    setEmail("");
  };

  // Show only 5 categories
  const displayedCategories = categories?.slice(0, 5) || [];

  return (
    <footer className=" border-t ">
      <div className="mx-auto px-4 pt-5 ">
        {/* Top Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-6">
          {/* Logo + Newsletter */}
          <div className="md:col-span-2 space-y-6">
            {/* Logo */}
            <Link href="/" aria-label="go home" className="block">
              <div className="flex items-center gap-3 cursor-pointer">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold shadow-md">
                  W-M
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
            <form className="space-y-3 felx w-full" onSubmit={handleSubmit}>
              <Label htmlFor="newsletter" className="text-sm font-medium">
                Subscribe to our Newsletter
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  id="newsletter"
                  placeholder="Enter your email"
                  className="h-9 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" size="sm" disabled={isSubscribing}>
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              <span className="text-xs text-muted-foreground block">
                Stay updated with the latest offers & news.
              </span>
            </form>
          </div>

          {/* Categories */}
          <div className="lg:block hidden">
            <span className="block font-semibold text-sm mb-3">Categories</span>
            <ul className="space-y-2 text-sm">
              {displayedCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Show More link if more than 5 */}
            {categories && categories.length > 5 && (
              <Link
                href="/category"
                className="mt-2 block text-sm text-primary hover:underline"
              >
                Show More →
              </Link>
            )}
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
            {/* Categories */}
            <div className="block lg:hidden">
              <span className="block font-semibold text-sm mb-3">
                Categories
              </span>
              <ul className="space-y-2 text-sm">
                {displayedCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/category/${cat.id}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Show More link if more than 5 */}
              {categories && categories.length > 5 && (
                <Link
                  href="/category"
                  className="mt-2 block text-sm text-primary hover:underline"
                >
                  Show More →
                </Link>
              )}
            </div>
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
