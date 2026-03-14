import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Swal from "sweetalert2";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { createChapter, updateChapter, getChapterById } from "../services/chapterService";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

interface ChapterFormProps {
  mode: "add" | "edit" | "detail";
}

const ADD_STORY_DRAFT_KEY = "add-story-draft";

interface DraftChapter {
  id: string;
  title: string;
  content: string;
  storyId: string;
  createdAt: string;
  updatedAt: string;
}

interface AddStoryDraft {
  title: string;
  author: string;
  synopsis: string;
  category: string;
  status: string;
  tags: string[];
  chapters: DraftChapter[];
}

const readAddStoryDraft = (): AddStoryDraft => {
  const fallback: AddStoryDraft = {
    title: "",
    author: "",
    synopsis: "",
    category: "",
    status: "Draft",
    tags: [],
    chapters: [],
  };

  try {
    const raw = sessionStorage.getItem(ADD_STORY_DRAFT_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as Partial<AddStoryDraft>;
    return {
      ...fallback,
      ...parsed,
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      chapters: Array.isArray(parsed.chapters) ? parsed.chapters : [],
    };
  } catch {
    return fallback;
  }
};

const writeAddStoryDraft = (draft: AddStoryDraft) => {
  sessionStorage.setItem(ADD_STORY_DRAFT_KEY, JSON.stringify(draft));
};

const QUILL_MODULES = {
  toolbar: [
    [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ size: ["small", false, "large", "huge"] }],
    [{ align: [] }],
    [{ header: [1, 2, 3, 4, 5, false] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "code-block", "image"],
    ["clean"],
  ],
};

const ChapterForm: React.FC<ChapterFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id: storyId, chapterId } = useParams<{ id?: string; chapterId?: string }>();
  const isDraftMode = !storyId;
  const isReadonly = mode === "detail";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if ((mode === "edit" || mode === "detail") && storyId && chapterId) {
      getChapterById(storyId, chapterId)
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);
        })
        .catch(() => {
          Swal.fire("Error", "Failed to load chapter", "error");
          navigate(-1);
        });
    }

    if ((mode === "edit" || mode === "detail") && isDraftMode && chapterId) {
      const draft = readAddStoryDraft();
      const chapter = draft.chapters.find((item) => item.id === chapterId);

      if (!chapter) {
        Swal.fire("Error", "Chapter not found", "error");
        navigate("/stories/add");
        return;
      }

      setTitle(chapter.title);
      setContent(chapter.content);
    }
  }, [mode, storyId, chapterId, isDraftMode, navigate]);

  const handleSave = async () => {
    if (isReadonly) {
      navigate(isDraftMode ? "/stories/add" : `/stories/${storyId}/edit`);
      return;
    }

    if (!title.trim()) {
      Swal.fire("Validation", "Title is required", "warning");
      return;
    }
    if (!content.trim() || content === "<p><br></p>") {
      Swal.fire("Validation", "Content is required", "warning");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "add" && isDraftMode) {
        const draft = readAddStoryDraft();
        const now = new Date().toISOString();

        draft.chapters = [
          {
            id: crypto.randomUUID(),
            title,
            content,
            storyId: "",
            createdAt: now,
            updatedAt: now,
          },
          ...draft.chapters,
        ];
        writeAddStoryDraft(draft);
        navigate("/stories/add");
      } else if (mode === "add") {
        await createChapter(storyId!, { title, content });
        navigate(`/stories/${storyId}/edit`);
      } else if (isDraftMode && chapterId) {
        const draft = readAddStoryDraft();
        draft.chapters = draft.chapters.map((chapter) =>
          chapter.id === chapterId
            ? {
                ...chapter,
                title,
                content,
                updatedAt: new Date().toISOString(),
              }
            : chapter
        );
        writeAddStoryDraft(draft);
        navigate("/stories/add");
      } else {
        await updateChapter(storyId!, chapterId!, { title, content });
        navigate(`/stories/${storyId}/edit`);
      }
    } catch {
      Swal.fire("Error", "Failed to save chapter", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const pageTitle = mode === "add" ? "Add Chapter" : mode === "edit" ? "Edit Chapter" : "Chapter Detail";

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
        <Link to="/stories" className="hover:text-gray-600">Stories Management</Link>
        <span>›</span>
        <Link to={isDraftMode ? "/stories/add" : `/stories/${storyId}/edit`} className="hover:text-gray-600">
          {mode === "add" ? "Add Stories" : isReadonly ? "Story Detail" : "Edit Story"}
        </Link>
        <span>›</span>
        <span className="text-cyan-500">{pageTitle}</span>
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
        <div className="mb-6">
          <Input
            label="Title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isReadonly}
          />
        </div>
        <div className="mb-8">
          <label className="text-sm font-semibold text-gray-700 block mb-2">Story</label>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={isReadonly ? { toolbar: false } : QUILL_MODULES}
              readOnly={isReadonly}
              className="min-h-75"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            variant="secondary"
            onClick={() => {
              if (isDraftMode) {
                navigate("/stories/add");
                return;
              }
              navigate(-1);
            }}
          >
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

export default ChapterForm;
