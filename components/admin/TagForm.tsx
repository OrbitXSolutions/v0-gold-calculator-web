"use client";
import React from "react";
import { createTag, updateTag } from "../../lib/api";
import { TagDto } from "../../types/blog";

interface TagFormProps {
  tag?: TagDto;
  onSaved?: (t: TagDto) => void;
}

export function TagForm({ tag, onSaved }: TagFormProps) {
  const [name, setName] = React.useState(tag?.name || "");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true); setError(null);
    try {
      let saved: TagDto;
      if (!tag) saved = await createTag(name.trim()); else saved = await updateTag(tag.id, name.trim());
      onSaved?.(saved);
      if (!tag) setName("");
    } catch (err: any) {
      setError(err.message || "Failed to save tag");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input value={name} onChange={e => setName(e.target.value)} required placeholder="Tag name" className="flex-1 rounded border px-3 py-2 text-sm" />
      <button disabled={loading} type="submit" className="rounded bg-yellow-500 hover:bg-yellow-600 disabled:opacity-40 text-white px-4 py-2 text-sm font-medium">
        {loading ? "Saving..." : tag ? "Save" : "Add"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}
