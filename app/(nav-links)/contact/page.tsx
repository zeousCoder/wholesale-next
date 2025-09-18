import { Metadata } from "next";
import React from "react";
import ContactForm from "./_components/ContactForm";

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
