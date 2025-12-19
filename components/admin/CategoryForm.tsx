"use client";
import React from "react";
import { createCategory, updateCategory } from "../../lib/api";
import { CategoryDto } from "../../types/blog";

interface CategoryFormProps {
  category?: CategoryDto | null;
  onSaved?: (c: CategoryDto) => void;
  onCancelEdit?: () => void;
}

export function CategoryForm({ category, onSaved, onCancelEdit }: CategoryFormProps) {
  const [name, setName] = React.useState(category?.name || "");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      let saved: CategoryDto;
      if (!category) {
        saved = await createCategory(name.trim(), null);
      } else {
        saved = await updateCategory(category.id, name.trim(), null);
      }
      onSaved?.(saved);
      if (!category) { setName(""); }
    } catch (err: any) {
      setError(err.message || "Failed to save category");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div>
        <input value={name} onChange={e => setName(e.target.value)} required placeholder="Category name" className="w-full rounded border px-3 py-2 text-sm" />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button disabled={loading} type="submit" className="self-start rounded bg-yellow-500 hover:bg-yellow-600 disabled:opacity-40 text-white px-4 py-2 text-sm font-medium">
        {loading ? "Saving..." : category ? "Save" : "Add Category"}
      </button>
      {category && (
        <button type="button" onClick={onCancelEdit} className="text-xs mt-1 text-gray-500 hover:text-gray-700">Cancel edit</button>
      )}
    </form>
  );
}
