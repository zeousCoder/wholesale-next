"use client";

import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useBannerQuery from "@/hooks/useBanner";

export default function BannerTab() {
  const {
    banners,
    isLoading,
    uploadBanner,
    isUploading,
    deleteBanner,
    isDeleting,
    toggleBannerStatus,
    isToggling,
    updateBannerOrder,
    isUpdatingOrder,
  } = useBannerQuery();

  const specificSize = "1920 x 352";

  // Upload handler
  const handleUpload = (formData: FormData) => {
    uploadBanner(formData, {
      onSuccess: (res: any) => toast.success(res.message),
      onError: (err: any) =>
        toast.error(err.message || "Failed to upload banner"),
    });
  };

  // Delete handler
  const handleDelete = (id: string) => {
    deleteBanner(id, {
      onSuccess: (res: any) => toast.success(res.message),
      onError: (err: any) =>
        toast.error(err.message || "Failed to delete banner"),
    });
  };

  // Toggle active status
  const handleToggle = (id: string) => {
    toggleBannerStatus(id, {
      onSuccess: (res: any) => toast.success(res.message),
      onError: (err: any) =>
        toast.error(err.message || "Failed to toggle banner"),
    });
  };

  // Drag and drop reorder
  const handleDragEnd = (result: import("@hello-pangea/dnd").DropResult) => {
    if (!result.destination) return;

    const items = Array.from(banners || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateBannerOrder(
      items.map((b) => b.id),
      {
        onSuccess: () => toast.success("Banner order updated!"),
        onError: () => toast.error("Failed to update banner order"),
      }
    );
  };

  if (isLoading) return <div>Loading banners...</div>;

  return (
    <div className="space-y-6 p-4">
      {/* Upload Form */}
      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Upload New Banner</h2>
        <form action={handleUpload} className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="banner-image">Banner Image</Label>
            <Input
              id="banner-image"
              name="file"
              type="file"
              accept="image/*"
              required
            />
          </div>
          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </div>

      {/* Banner List */}
      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Current Banners - size {specificSize}
        </h2>

        {!banners || banners.length === 0 ? (
          <p className="text-muted-foreground">No banners uploaded yet</p>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="banners">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {banners.map((banner, index) => (
                    <Draggable
                      key={banner.id}
                      draggableId={banner.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex flex-col lg:flex-row items-center gap-4 p-4 border rounded-lg bg-background"
                        >
                          {/* Drag handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab hover:cursor-grabbing"
                          >
                            <GripIcon className="h-5 w-5 text-muted-foreground" />
                          </div>

                          {/* Banner image */}
                          <img
                            src={banner.image}
                            alt="Banner"
                            className="h-16 w-auto object-cover rounded"
                          />

                          {/* Details + Actions */}
                          <div className="flex flex-1 flex-col lg:flex-row gap-4 items-center w-full">
                            <div className="flex flex-col">
                              <p className="font-medium">
                                Order: {banner.order}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  banner.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Switch
                                id={`active-${banner.id}`}
                                checked={banner.active}
                                disabled={isToggling}
                                onCheckedChange={() => handleToggle(banner.id)}
                              />
                              <Label htmlFor={`active-${banner.id}`}>
                                {banner.active ? "Active" : "Inactive"}
                              </Label>
                            </div>

                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={isDeleting}
                              onClick={() => handleDelete(banner.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
}

// Grip Icon
function GripIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  );
}
