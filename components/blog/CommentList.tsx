"use client";
import React from "react";
import { getComments, formatDate } from "../../lib/api";
import { CommentDto } from "../../types/blog";

interface CommentListProps {
  blogId: string;
}

export function CommentList({ blogId }: CommentListProps) {
  const [comments, setComments] = React.useState<CommentDto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const paged = await getComments(blogId, { page: 1, pageSize: 50 });
      setComments(paged.items.filter(c => !c.isDeleted));
    } catch (err: any) {
      setError(err.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  if (loading) return <p className="text-sm text-gray-500">Loading comments...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (comments.length === 0) return <p className="text-sm text-gray-500">No comments yet. Be the first.</p>;

  return (
    <ul className="space-y-4">
      {comments.map(c => (
        <li key={c.id} className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-800">{c.authorDisplayName}</span>
            <span className="text-xs text-gray-500">{formatDate(c.createdUtc)}</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{c.content}</p>
        </li>
      ))}
    </ul>
  );
}
