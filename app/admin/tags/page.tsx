export const dynamic = "force-dynamic"
import { getTags } from "../../../lib/api"
import { TagForm } from "../../../components/admin/TagForm"

export const revalidate = 60

export default async function AdminTagsPage() {
  const tags = await getTags()
  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-semibold text-white mb-2">Tags</h1>
        <p className="text-sm text-gray-400">Organize your content with tags</p>
      </div>

      <div className="admin-card p-6">
        <TagForm onSaved={() => {}} />
      </div>

      <div className="admin-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 border-b border-gray-800">
            <tr className="text-left">
              <th className="p-4 text-gray-400 font-medium">Name</th>
              <th className="p-4 text-gray-400 font-medium">Slug</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {tags.map((t) => (
              <tr key={t.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-medium">{t.name}</td>
                <td className="p-4 text-gray-400 text-xs">{t.slug}</td>
              </tr>
            ))}
            {tags.length === 0 && (
              <tr>
                <td colSpan={2} className="p-8 text-center text-gray-500">
                  No tags yet. Create your first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
