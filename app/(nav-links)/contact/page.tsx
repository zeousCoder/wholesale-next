import ContactForm from "@/components/contact/ContactForm";
import { Metadata } from "next";
import React from "react";

export default function Contact() {
  return (
    <div>
      <ContactForm />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Contact Us",
  description: "wholesale products in muradnagar",
};
