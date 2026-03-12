import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, SlidersHorizontal, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { getStories, deleteStory } from "../services/storyService";
import type { Story } from "../types";
import { CATEGORIES, STATUSES } from "../types";
import { useDebounce } from "../hooks/useDebounce";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";
import Modal from "../components/common/Modal";
import Select from "../components/common/Select";

const LIMIT = 5;

const StoryList: React.FC = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [pendingCategory, setPendingCategory] = useState("");
  const [pendingStatus, setPendingStatus] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStories({
        search: debouncedSearch,
        category: filterCategory,
        status: filterStatus,
        page,
        limit: LIMIT,
      });
      setStories(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {
      Swal.fire("Error", "Failed to load stories", "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filterCategory, filterStatus, page]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Delete Story?",
      text: `Are you sure you want to delete "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    });
    if (result.isConfirmed) {
      try {
        await deleteStory(id);
        Swal.fire("Deleted!", "Story has been deleted.", "success");
        fetchStories();
      } catch {
        Swal.fire("Error", "Failed to delete story", "error");
      }
    }
    setOpenMenuId(null);
  };

  const applyFilter = () => {
    setFilterCategory(pendingCategory);
    setFilterStatus(pendingStatus);
    setPage(1);
    setFilterOpen(false);
  };

  const resetFilter = () => {
    setPendingCategory("");
    setPendingStatus("");
    setFilterCategory("");
    setFilterStatus("");
    setPage(1);
    setFilterOpen(false);
  };

  const openFilter = () => {
    setPendingCategory(filterCategory);
    setPendingStatus(filterStatus);
    setFilterOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Stories</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Writers /Title"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <button
            onClick={openFilter}
            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal size={18} className="text-gray-500" />
          </button>
          <Button onClick={() => navigate("/stories/add")} className="ml-auto">
            <Plus size={16} />
            Add Story
          </Button>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="pb-3 font-semibold text-gray-600 w-10">No</th>
                <th className="pb-3 font-semibold text-gray-600">Title</th>
                <th className="pb-3 font-semibold text-gray-600">Writers</th>
                <th className="pb-3 font-semibold text-gray-600">Category</th>
                <th className="pb-3 font-semibold text-gray-600">Keyword</th>
                <th className="pb-3 font-semibold text-gray-600">Status</th>
                <th className="pb-3 font-semibold text-gray-600 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">Loading...</td>
                </tr>
              ) : stories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">No stories found</td>
                </tr>
              ) : (
                stories.map((story, idx) => (
                  <tr key={story.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 text-gray-500">{(page - 1) * LIMIT + idx + 1}</td>
                    <td className="py-3 font-medium text-gray-800 max-w-[180px] truncate">{story.title}</td>
                    <td className="py-3 text-gray-600">{story.author}</td>
                    <td className="py-3 text-gray-600">{story.category}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {(story.tags || []).map((tag) => (
                          <Badge key={tag} label={tag} />
                        ))}
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge
                        label={story.status}
                        variant={story.status === "Publish" ? "publish" : "draft"}
                      />
                    </td>
                    <td className="py-3">
                      <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === story.id ? null : story.id)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal size={18} className="text-gray-500" />
                      </button>
                      {openMenuId === story.id && (
                        <div className="absolute right-0 top-8 bg-white shadow-lg rounded-xl border border-gray-100 z-50 w-36 py-1">
                          <button
                            onClick={() => { navigate(`/stories/${story.id}`); setOpenMenuId(null); }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            onClick={() => { navigate(`/stories/${story.id}/edit`); setOpenMenuId(null); }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(story.id, story.title)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Menampilkan {stories.length} dari {total} data
          </p>
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      </div>

      {/* filter modal */}
      <Modal isOpen={filterOpen} onClose={() => setFilterOpen(false)} title="Filter">
        <div className="flex flex-col gap-5">
          <Select
            label="Category"
            value={pendingCategory}
            onChange={(e) => setPendingCategory(e.target.value)}
            options={[
              { value: "", label: "Category" },
              ...CATEGORIES.map((c) => ({ value: c, label: c })),
            ]}
          />
          <Select
            label="Status"
            value={pendingStatus}
            onChange={(e) => setPendingStatus(e.target.value)}
            options={[
              { value: "", label: "All Status" },
              ...STATUSES.map((s) => ({ value: s, label: s })),
            ]}
          />
          <div className="flex items-center justify-between pt-2">
            <Button variant="secondary" onClick={resetFilter}>Reset</Button>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setFilterOpen(false)}>Cancel</Button>
              <Button onClick={applyFilter}>Filter</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StoryList;
