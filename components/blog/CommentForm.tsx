"use client";
import React from "react";
import { postComment } from "../../lib/api";

interface CommentFormProps {
  blogId: string;
  onPosted?: () => void;
}

export function CommentForm({ blogId, onPosted }: CommentFormProps) {
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await postComment(blogId, value.trim());
      setValue("");
      onPosted?.();
    } catch (err: any) {
      setError(err.message || "Failed to post comment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Share your thoughts..."
        rows={4}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none resize-y"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="rounded-lg bg-yellow-500 hover:bg-yellow-600 disabled:opacity-40 text-white text-sm font-medium px-4 py-2 shadow-sm"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
        <button
          type="button"
          disabled={loading || !value}
          onClick={() => setValue("")}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
