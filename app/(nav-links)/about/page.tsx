import { Metadata } from "next";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkle, MapPin, ShoppingBag, ThumbsUp } from "lucide-react";
import React from "react";

export const metadata: Metadata = {
  title: "About",
  description: "wholesale products in Muradnagar",
};

export default function About() {
  return (
    <main className="w-full max-w-2xl mx-auto py-10 px-4 flex flex-col gap-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-4">
        <Badge variant="default" className="mb-2 text-base px-4 py-2">
          Wholesale Market — Muradnagar
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-sm flex items-center gap-2">
          <Sparkle className="h-7 w-7 text-indigo-500" />
          Bringing you the best deals, always
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Wholesale Market is Muradnagar’s trusted platform for sourcing
          products in bulk — from essentials to trending goods — tailored for
          businesses, organizations, and smart shoppers.
        </p>
        <Button className="mt-4" variant="secondary">
          Browse Categories
        </Button>
      </section>

      {/* Brand Story */}
      <Card className="bg-gray-50">
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cyan-500" /> Our Roots
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Started in Muradnagar, our market was founded to connect buyers and
            sellers through one reliable, easy-to-use platform. We work with
            local suppliers you know and trust, and we’re always adding new
            partners to help bring you more choices and better prices.
          </p>
        </CardContent>
      </Card>

      {/* Mission and Values */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-green-600" /> Our Promise
          </h2>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mt-2">
            <li className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-indigo-600" />
              <span>Quality products at honest prices</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-cyan-600" />
              <span>Local support, fast delivery</span>
            </li>
            <li className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-green-600" />
              <span>Guaranteed satisfaction — or we make it right</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Meet Our Team</h2>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="w-14 h-14">
                <AvatarImage src="" alt="Team Member" />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <span className="font-medium">Mohit Singh</span>
              <span className="text-xs text-muted-foreground">
                Founder & Market Lead
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar className="w-14 h-14">
                <AvatarImage src="" alt="Team Member" />
                <AvatarFallback>K</AvatarFallback>
              </Avatar>
              <span className="font-medium">Kiran Patel</span>
              <span className="text-xs text-muted-foreground">
                Operations & Support
              </span>
            </div>
            {/* Add more team members if needed */}
          </div>
        </CardContent>
      </Card>

      {/* Contact & CTA */}
      <section className="flex flex-col items-center text-center gap-2 py-8">
        <h2 className="text-lg font-semibold mb-2">
          Got questions or want to partner?
        </h2>
        <p className="text-muted-foreground mb-2">
          Reach out via our contact form, email, or call — our team is here to
          help!
        </p>
        <Button variant="default" className="w-fit">
          Contact Us
        </Button>
      </section>
    </main>
  );
}
