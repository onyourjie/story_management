import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronLeft, Plus, MoreHorizontal, Pencil, Trash2, Image } from "lucide-react";
import Swal from "sweetalert2";
import { format } from "../utils/date";
import { createStory, updateStory, getStoryById } from "../services/storyService";
import { deleteChapter } from "../services/chapterService";
import type { Story, Chapter } from "../types";
import { CATEGORIES, STATUSES } from "../types";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Select from "../components/common/Select";
import TagInput from "../components/common/TagInput";

interface StoryFormProps {
  mode: "add" | "edit" | "detail";
}

const StoryForm: React.FC<StoryFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Draft");
  const [tags, setTags] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isReadonly = mode === "detail";

  useEffect(() => {
    if ((mode === "edit" || mode === "detail") && id) {
      getStoryById(id).then((res) => {
        const s: Story = res.data;
        setTitle(s.title);
        setAuthor(s.author);
        setSynopsis(s.synopsis);
        setCategory(s.category);
        setStatus(s.status);
        setTags(s.tags || []);
        setChapters(s.chapters || []);
        if (s.coverImage) setCoverPreview(`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}${s.coverImage}`);
      }).catch(() => {
        Swal.fire("Error", "Failed to load story", "error");
        navigate("/stories");
      });
    }
  }, [id, mode, navigate]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = async () => {
    if (mode === "detail") { navigate("/stories"); return; }
    const result = await Swal.fire({
      title: "Cancel?",
      text: "Are you sure you want to cancel adding the story without saving the data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      cancelButtonText: "Stay",
    });
    if (result.isConfirmed) navigate("/stories");
  };

  const handleSave = async () => {
    if (!title || !author || !synopsis || !category) {
      Swal.fire("Validation", "Please fill in all required fields", "warning");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("synopsis", synopsis);
      formData.append("category", category);
      formData.append("status", status);
      formData.append("tags", JSON.stringify(tags));
      if (coverFile) formData.append("coverImage", coverFile);

      if (mode === "add") {
        await createStory(formData);
        Swal.fire("Success!", "Story created successfully.", "success");
      } else {
        await updateStory(id!, formData);
        Swal.fire("Success!", "Story updated successfully.", "success");
      }
      navigate("/stories");
    } catch {
      Swal.fire("Error", "Failed to save story", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string, chapterTitle: string) => {
    const result = await Swal.fire({
      title: "Delete Chapter?",
      text: `Delete "${chapterTitle}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    });
    if (result.isConfirmed) {
      try {
        await deleteChapter(id!, chapterId);
        setChapters((prev) => prev.filter((c) => c.id !== chapterId));
        Swal.fire("Deleted!", "", "success");
      } catch {
        Swal.fire("Error", "Failed to delete chapter", "error");
      }
    }
    setOpenMenuId(null);
  };

  const pageTitle = mode === "add" ? "Add Stories" : mode === "edit" ? "Edit Story" : "Story Detail";
  const breadcrumb = mode === "add" ? "Add Stories" : mode === "edit" ? "Edit Story" : "Story Detail";

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <Link to="/stories" className="hover:text-gray-600">Stories Management</Link>
        <span>›</span>
        <span className="text-cyan-500">{breadcrumb}</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{pageTitle}</h1>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-full px-3 py-1.5 mb-6"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        {/* general info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Input
            label="Title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isReadonly}
          />
          <Input
            label="Writer Name"
            placeholder="Writer Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={isReadonly}
          />
        </div>
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 block mb-1">Synopsis</label>
          <textarea
            placeholder="Synopsis"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            disabled={isReadonly}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isReadonly}
            options={[
              { value: "", label: "Category" },
              ...CATEGORIES.map((c) => ({ value: c, label: c })),
            ]}
          />
          <TagInput
            label="Tags/Keywords Story"
            tags={tags}
            onChange={setTags}
            disabled={isReadonly}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Cover Image</label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3">
              {coverPreview ? (
                <img src={coverPreview} alt="cover" className="h-12 w-12 object-cover rounded-lg" />
              ) : (
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                  <Image size={24} />
                </div>
              )}
              {!isReadonly && (
                <input type="file" accept="image/*" onChange={handleCoverChange} className="text-sm text-gray-500" />
              )}
            </div>
          </div>
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isReadonly}
            options={STATUSES.map((s) => ({ value: s, label: s }))}
          />
        </div>

        {/* chapter section*/}
        {!isReadonly && mode === "edit" && (
          <div className="flex justify-end mb-4">
            <Button onClick={() => navigate(`/stories/${id}/chapters/add`)}>
              <Plus size={16} />
              Add Chapter
            </Button>
          </div>
        )}
        {mode === "add" && (
          <p className="text-sm text-gray-400 mb-4 italic">Save the story first to add chapters.</p>
        )}

        {chapters.length > 0 && (
          <div className="border border-gray-100 rounded-xl overflow-visible mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Last Updated</th>
                  {!isReadonly && <th className="w-10"></th>}
                </tr>
              </thead>
              <tbody>
                {chapters.map((ch) => (
                  <tr key={ch.id} className="border-t border-gray-100 hover:bg-gray-50 relative">
                    <td className="px-4 py-3 text-gray-800">{ch.title}</td>
                    <td className="px-4 py-3 text-gray-500">{format(ch.updatedAt)}</td>
                    {!isReadonly && (
                      <td className="px-4 py-3">
                        <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === ch.id ? null : ch.id)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <MoreHorizontal size={16} className="text-gray-500" />
                        </button>
                        {openMenuId === ch.id && (
                          <div className="absolute right-0 top-8 bg-white shadow-lg rounded-xl border border-gray-100 z-50 w-32 py-1">
                            <button
                              onClick={() => { navigate(`/stories/${id}/chapters/${ch.id}/edit`); setOpenMenuId(null); }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                            >
                              <Pencil size={13} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteChapter(ch.id, ch.title)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={handleCancel}>
            {isReadonly ? "Back" : "Cancel"}
          </Button>
          {!isReadonly && (
            <Button onClick={handleSave} disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryForm;
