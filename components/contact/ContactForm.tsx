"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import React, { useRef, useTransition } from "react";
import { submitContactForm } from "@/actions/contactAction";
import { toast } from "sonner";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(formRef.current!);

    startTransition(async () => {
      const res = await submitContactForm(formData);

      if (res.success) {
        toast.success(res.message);
        formRef.current?.reset(); // ✅ safe
      } else {
        toast.error(res.message);
      }
    });
  }
  return (
    <section className="py-10">
      <div className="mx-auto w-full  px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Contact <span className="text-primary">Wholesale Market</span>
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Whether you’re a supplier, retailer, or partner — we’d love to hear
            from you. Reach out to the right team below or fill out the form and
            we’ll get back to you shortly.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="p-6 text-center shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Sales</h3>
            <Link
              href="mailto:sales@wholesalemarket.com"
              className="text-primary hover:underline block"
            >
              sales@wholesalemarket.com
            </Link>
            <p className="mt-2 text-sm text-gray-500">+91 98765 43210</p>
          </Card>

          <Card className="p-6 text-center shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Press</h3>
            <Link
              href="mailto:press@wholesalemarket.com"
              className="text-primary hover:underline block"
            >
              press@wholesalemarket.com
            </Link>
            <p className="mt-2 text-sm text-gray-500">+91 98765 43211</p>
          </Card>

          <Card className="p-6 text-center shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Support</h3>
            <Link
              href="mailto:support@wholesalemarket.com"
              className="text-primary hover:underline block"
            >
              support@wholesalemarket.com
            </Link>
            <p className="mt-2 text-sm text-gray-500">+91 98765 43212</p>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="mx-auto max-w-3xl p-8 shadow-md">
          <h3 className="text-2xl font-semibold mb-2">Send us your inquiry</h3>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Fill in your details and our team will connect with you soon.
          </p>

          <form className="space-y-6" ref={formRef} onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input type="text" id="name" name="name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="msg">Message</Label>
              <Textarea
                id="msg"
                name="message"
                rows={4}
                placeholder="Type your message..."
              />
            </div>

            <Button className="w-full" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
