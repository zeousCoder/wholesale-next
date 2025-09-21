"use client";
import React, { useState } from "react";
import { useCart } from "@/hooks/useAddToCart";
import { useAddresses } from "@/hooks/useAddresses";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CheckoutButton from "@/components/layout/CheckoutButton";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const userId =
    session?.user?.id ||
    (typeof window !== "undefined"
      ? window.localStorage.getItem("userId")
      : "demo-user");
  const { cart, isLoading: cartLoading } = useCart(userId ?? "");
  const {
    data: addresses,
    isLoading: addressesLoading,
    addAddress,
    isAdding,
  } = useAddresses();
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.street ||
      !form.city ||
      !form.state ||
      !form.pincode ||
      !form.phone
    ) {
      toast.error("All fields are required");
      return;
    }
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    addAddress(formData, {
      onSuccess: (address: any) => {
        setForm({ street: "", city: "", state: "", pincode: "", phone: "" });
        setSelectedAddress(address?.id);
        toast.success("Address added and selected!");
      },
      onError: () => toast.error("Failed to add address"),
    });
  };

  if (cartLoading || addressesLoading) {
    return (
      <div className="p-8 text-center flex items-center justify-center text-gray-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">Your cart is empty.</div>
    );
  }

  const totalPrice = cart.items.reduce(
    (total: number, item: any) => total + item.quantity * item.product.price,
    0
  );

  return (
    <div className=" mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Cart Summary */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <Card className="p-4 space-y-4">
          {cart.items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b pb-3 last:border-b-0 last:pb-0"
            >
              <img
                src={item.product.images?.[0]}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-medium">{item.product.name}</div>
                <div className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </div>
              </div>
              <div className="font-semibold">
                ₹{(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg pt-4">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </Card>
      </div>

      {/* Address & Checkout */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
        <div className="space-y-4">
          {/* Existing addresses */}
          {addresses && addresses.length > 0 && (
            <div className="space-y-2">
              {addresses.map((addr: any) => (
                <label
                  key={addr.id}
                  className={`flex items-center gap-2 p-3 border rounded cursor-pointer ${
                    selectedAddress === addr.id
                      ? "border-blue-600 bg-blue-50"
                      : "hover:border-blue-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddress === addr.id}
                    onChange={() => setSelectedAddress(addr.id)}
                  />
                  <span>
                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}{" "}
                    <br />
                    <span className="text-xs text-gray-500">{addr.phone}</span>
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* Add new address */}
          <form
            onSubmit={handleAddAddress}
            className="space-y-2 border rounded p-4 mt-2"
          >
            <div className="font-semibold mb-2">Add New Address</div>
            <Textarea
              id="street"
              name="street"
              value={form.street}
              onChange={handleChange}
              placeholder="House No, Street, Locality"
              className="resize-none"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
              />
              <Input
                id="state"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
              />
              <Input
                id="pincode"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Pincode"
              />
            </div>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Mobile Number"
            />
            <Button type="submit" className="w-full" disabled={isAdding}>
              {isAdding ? "Saving..." : "Save Address"}
            </Button>
          </form>

          {/* Checkout Button */}
          <div className="pt-4">
            <CheckoutButton
              userId={userId ?? ""}
              totalAmount={totalPrice}
              disabled={!selectedAddress}
            />
            {!selectedAddress && (
              <div className="text-xs text-red-500 mt-2">
                Please select or add an address to proceed.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
