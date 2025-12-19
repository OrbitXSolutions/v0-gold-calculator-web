"use client"
import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"
import { defaultSchema } from "hast-util-sanitize"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Heading from "@tiptap/extension-heading"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"
import CodeBlock from "@tiptap/extension-code-block"
import TextAlign from "@tiptap/extension-text-align"
import { Markdown } from "tiptap-markdown"
import { uploadMedia } from "../../lib/api"
import {
  Bold,
  Italic,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  LinkIcon,
  List,
  ListOrdered,
  Table,
  Minus,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  Edit3,
  Upload,
} from "lucide-react"

interface RichMarkdownEditorProps {
  value: string
  onChange: (v: string) => void
  height?: number
}

export function RichMarkdownEditor({ value, onChange, height = 400 }: RichMarkdownEditorProps) {
  const [preview, setPreview] = React.useState(false)
  const [dir, setDir] = React.useState<"ltr" | "rtl">("ltr")
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      Link.configure({ autolink: true, openOnClick: true, linkOnPaste: true }),
      Image,
      BulletList,
      OrderedList,
      ListItem,
      CodeBlock,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Markdown.configure({ html: false, transformPastedText: true }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      const md = editor.storage.markdown.getMarkdown()
      onChange(md)
    },
  })

  function apply(syntax: string) {
    if (!editor) return
    editor.commands.insertContent(syntax)
  }

  const wordCount = value.trim().split(/\s+/).filter(Boolean).length
  const charCount = value.length

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    try {
      const media = await uploadMedia(file)
      if (media?.url) {
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.goldchecker.ae"
        const fullImageUrl = `${backendUrl}${media.url}`
        const altText = media.fileName || file.name
        apply(`![${altText}](${fullImageUrl})`)
      }
    } catch (err: any) {
      console.error("Image upload failed", err)
      alert(err?.message || "Image upload failed")
    }
  }

  const ToolbarButton = ({
    onClick,
    active,
    icon: Icon,
    label,
  }: {
    onClick: () => void
    active?: boolean
    icon: any
    label: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`p-2 rounded-lg transition-all hover:bg-gray-200 ${
        active ? "bg-amber-600 text-white" : "text-gray-600"
      }`}
    >
      <Icon size={18} />
    </button>
  )

  return (
    <div className="rounded-lg border border-gray-300 bg-white shadow-lg overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50">
        {/* Top row - Text formatting */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-600 mr-2">Format:</span>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            active={editor?.isActive("bold")}
            icon={Bold}
            label="Bold"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            active={editor?.isActive("italic")}
            icon={Italic}
            label="Italic"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCode().run()}
            active={editor?.isActive("code")}
            icon={Code}
            label="Inline Code"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            active={editor?.isActive("codeBlock")}
            icon={Type}
            label="Code Block"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            active={editor?.isActive("blockquote")}
            icon={Quote}
            label="Quote"
          />

          <div className="h-6 w-px bg-gray-200 mx-1" />

          {/* Headings */}
          <span className="text-xs font-semibold text-gray-600 mr-2">Heading:</span>
          <ToolbarButton
            onClick={() => editor?.chain().focus().setHeading({ level: 1 }).run()}
            active={editor?.isActive("heading", { level: 1 })}
            icon={Heading1}
            label="Heading 1"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().setHeading({ level: 2 }).run()}
            active={editor?.isActive("heading", { level: 2 })}
            icon={Heading2}
            label="Heading 2"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().setHeading({ level: 3 }).run()}
            active={editor?.isActive("heading", { level: 3 })}
            icon={Heading3}
            label="Heading 3"
          />
        </div>

        {/* Second row - Lists, alignment, and media */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-600 mr-2">Lists:</span>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            active={editor?.isActive("bulletList")}
            icon={List}
            label="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            active={editor?.isActive("orderedList")}
            icon={ListOrdered}
            label="Numbered List"
          />

          <div className="h-6 w-px bg-gray-200 mx-1" />

          {/* Alignment */}
          <span className="text-xs font-semibold text-gray-600 mr-2">Align:</span>
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
            active={editor?.isActive({ textAlign: "left" })}
            icon={AlignLeft}
            label="Align Left"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
            active={editor?.isActive({ textAlign: "center" })}
            icon={AlignCenter}
            label="Align Center"
          />
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
            active={editor?.isActive({ textAlign: "right" })}
            icon={AlignRight}
            label="Align Right"
          />

          <div className="h-6 w-px bg-gray-200 mx-1" />

          {/* Insert elements */}
          <span className="text-xs font-semibold text-gray-600 mr-2">Insert:</span>
          <ToolbarButton onClick={() => apply("[text](url)")} icon={LinkIcon} label="Insert Link" />
          <ToolbarButton onClick={openFilePicker} icon={Upload} label="Upload Image" />
          <button
            type="button"
            onClick={() => apply("\n\n| Column A | Column B |\n|---|---|\n| Val 1 | Val 2 |\n\n")}
            title="Insert Table"
            className="p-2 rounded-lg transition-all hover:bg-gray-200 text-gray-600"
          >
            <Table size={18} />
          </button>
          <button
            type="button"
            onClick={() => apply("\n\n---\n\n")}
            title="Insert Horizontal Rule"
            className="p-2 rounded-lg transition-all hover:bg-gray-200 text-gray-600"
          >
            <Minus size={18} />
          </button>

          {/* Right side controls */}
          <div className="ml-auto flex items-center gap-2">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setDir("ltr")}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  dir === "ltr" ? "bg-amber-600 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                LTR
              </button>
              <button
                type="button"
                onClick={() => setDir("rtl")}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  dir === "rtl" ? "bg-amber-600 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                RTL
              </button>
            </div>
            <button
              type="button"
              onClick={() => setPreview((p) => !p)}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-all font-medium"
            >
              {preview ? (
                <>
                  <Edit3 size={16} />
                  Edit
                </>
              ) : (
                <>
                  <Eye size={16} />
                  Preview
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />

      {!preview ? (
        <div className="p-4 bg-white" dir={dir}>
          <EditorContent
            editor={editor}
            className="tiptap-editor bg-white border border-gray-200 rounded-lg min-h-[400px] prose prose-gray max-w-none"
          />
        </div>
      ) : (
        <div
          className="prose prose-gray max-w-none p-6 overflow-y-auto bg-white"
          style={{ maxHeight: height }}
          dir={dir}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              [
                rehypeSanitize,
                {
                  ...defaultSchema,
                  attributes: {
                    ...defaultSchema.attributes,
                    img: ["src", "alt", "title"],
                    a: ["href", "title", "target", "rel"],
                  },
                  protocols: {
                    ...((defaultSchema as any).protocols || {}),
                    src: ["http", "https", "data"],
                    href: ["http", "https", "mailto"],
                  },
                },
              ],
            ]}
          >
            {value || "_Nothing to preview yet..._"}
          </ReactMarkdown>
        </div>
      )}

      <div className="px-4 py-2 text-xs text-gray-600 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="font-medium">{wordCount} words</span>
          <span className="text-gray-400">·</span>
          <span>{charCount} characters</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded text-[10px] font-medium ${
              preview ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {preview ? "Preview" : "Editing"}
          </span>
          <span className="text-gray-400">·</span>
          <span className="font-medium">{dir.toUpperCase()}</span>
        </div>
      </div>
    </div>
  )
}
