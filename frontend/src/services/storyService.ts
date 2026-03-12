import api from "./api";
import type { Story, StoryListQuery, PaginatedResponse } from "../types";

export const getStories = async (
  query: StoryListQuery = {}
): Promise<PaginatedResponse<Story>> => {
  const params = new URLSearchParams();
  if (query.search) params.append("search", query.search);
  if (query.category) params.append("category", query.category);
  if (query.status) params.append("status", query.status);
  if (query.page) params.append("page", String(query.page));
  if (query.limit) params.append("limit", String(query.limit));

  const { data } = await api.get(`/stories?${params.toString()}`);
  return data;
};

export const getStoryById = async (
  id: string
): Promise<{ success: boolean; data: Story }> => {
  const { data } = await api.get(`/stories/${id}`);
  return data;
};

export const createStory = async (formData: FormData) => {
  const { data } = await api.post("/stories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateStory = async (id: string, formData: FormData) => {
  const { data } = await api.put(`/stories/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteStory = async (id: string) => {
  const { data } = await api.delete(`/stories/${id}`);
  return data;
};

export const getStats = async () => {
  const { data } = await api.get("/stories/stats");
  return data;
};
