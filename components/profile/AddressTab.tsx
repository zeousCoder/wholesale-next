"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Trash2, Plus, MapPin, Phone, Home } from "lucide-react";
import { useAddresses } from "@/hooks/useAddresses";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};

export default function AddressTab() {
  const {
    data: addresses,
    isLoading,
    addAddress,
    deleteAddress,
    isAdding,
    isDeleting,
  } = useAddresses();

  const [form, setForm] = useState<Omit<Address, "id">>({
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

  const handleAdd = () => {
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
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value as string)
    );

    addAddress(formData, {
      onSuccess: () => {
        setForm({ street: "", city: "", state: "", pincode: "", phone: "" });
        toast.success("Address added successfully");
      },
      onError: () => {
        toast.error("Failed to add address");
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteAddress(id, {
      onSuccess: () => {
        toast.success("Address deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete address");
      },
    });
  };

  return (
    <div className="w-full flex flex-col gap-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <span className="text-xl font-bold flex items-center gap-2 ">
          <MapPin className="h-5 w-5 text-indigo-600" /> Address
        </span>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Your Address</DialogTitle>
              <DialogDescription asChild>
                <form
                  className="space-y-4 mt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAdd();
                  }}
                >
                  <div>
                    <Label htmlFor="street">Street</Label>
                    <Textarea
                      id="street"
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                      placeholder="House No, Street, Locality"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        placeholder="Pincode"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Mobile Number"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isAdding}>
                    {isAdding ? "Saving..." : "Save Address"}
                  </Button>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* Saved Addresses */}
      <div className="grid gap-6 md:grid-cols-2">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading addresses...</p>
        ) : addresses && addresses.length === 0 ? (
          <p className="text-sm text-gray-500">No addresses added yet.</p>
        ) : (
          addresses?.map((addr) => (
            <Card
              key={addr.id}
              className="p-5 pr-12 relative flex flex-col gap-2 border rounded-xl shadow-md  hover:shadow-lg transition"
            >
              <div className="flex gap-2 items-center mb-1">
                <Home className="h-5 w-5 text-green-600" />
                <span className="font-medium text-lg">{addr.street}</span>
              </div>
              <div className="flex gap-2 items-center">
                <MapPin className="h-4 w-4 text-indigo-600" />
                <span className="text-sm  font-medium">
                  {addr.city}, {addr.state} - {addr.pincode}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <Phone className="h-4 w-4 text-pink-600" />
                <span className="text-sm ">{addr.phone}</span>
              </div>
              <Badge variant="outline" className="mt-2 w-fit text-xs">
                Delivery
              </Badge>
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-4 right-4 shadow"
                onClick={() => handleDelete(addr.id)}
                disabled={isDeleting}
                aria-label="Delete Address"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
