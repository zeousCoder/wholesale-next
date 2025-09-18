"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2, Pencil } from "lucide-react";

export default function CategoryTab() {
  const {
    categories,
    isLoadingCategories,
    addCategory,
    editCategory,
    removeCategory,
    isAdding,
    isUpdating,
    isDeleting,
  } = useCategories();

  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // 📌 Handle Add Category
  const handleAdd = () => {
    if (!newCategory.trim()) return;
    addCategory(newCategory);
    setNewCategory("");
  };

  // 📌 Handle Update Category
  const handleUpdate = (id: string) => {
    if (!editName.trim()) return;
    editCategory({ id, name: editName });
    setEditId(null);
    setEditName("");
  };

  return (
    <div className="w-full p-4 space-y-6">
      {/* Add Category */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Enter category name..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button onClick={handleAdd} disabled={isAdding}>
          {isAdding && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Add
        </Button>
      </div>

      {/* Categories Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingCategories ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : categories && categories.length > 0 ? (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    {editId === cat.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      cat.name
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(cat.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    {editId === cat.id ? (
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(cat.id)}
                        disabled={isUpdating}
                      >
                        {isUpdating && (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        )}
                        Save
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditId(cat.id);
                          setEditName(cat.name);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeCategory(cat.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
