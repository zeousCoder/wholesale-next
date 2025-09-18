"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParams, useRouter } from "next/navigation";
import { User, MapPin, Heart, ShoppingBag, ShoppingCart } from "lucide-react";
import ProfileTab from "./ProfileTab";
import AddressTab from "./AddressTab";

export default function SidebarProfile() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "profile";

  const tabs = [
    { value: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    {
      value: "address",
      label: "Address",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      value: "wishlist",
      label: "Wishlist",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      value: "orders",
      label: "Orders",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      value: "cart",
      label: "Cart",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
  ];

  // Handle tab change → update URL query
  const handleTabChange = (value: string) => {
    router.replace(`/profile?tab=${value}`);
  };

  return (
    <div className="flex w-full  mx-auto px-4 py-8">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex w-full flex-col md:flex-row gap-6"
      >
        {/* Sidebar Navigation */}
        <TabsList className="flex md:flex-col lg:overflow-hidden overflow-x-auto md:w-64 w-full justify-start md:justify-normal gap-2 border rounded-2xl shadow-sm p-3 sticky top-6 h-fit">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-3 w-full md:justify-start px-4 py-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-muted transition"
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Scrollable Main Content */}
        <div className="flex-1 rounded-2xl border shadow-md">
          <ScrollArea className="h-[80vh] p-6">
            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>

            <TabsContent value="address">
              <AddressTab />
            </TabsContent>

            <TabsContent value="wishlist">
              <h2 className="text-xl font-semibold mb-3">❤️ Wishlist</h2>
              <p className="text-sm text-gray-600">
                View and manage your saved items.
              </p>
            </TabsContent>

            <TabsContent value="orders">
              <h2 className="text-xl font-semibold mb-3">🛍 Orders</h2>
              <p className="text-sm text-gray-600">
                Track your recent and past orders.
              </p>
            </TabsContent>

            <TabsContent value="cart">
              <h2 className="text-xl font-semibold mb-3">🛒 Cart</h2>
              <p className="text-sm text-gray-600">
                Review and manage items in your shopping cart.
              </p>
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
}
