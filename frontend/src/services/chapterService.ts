import api from "./api";
import type { Chapter } from "../types";

export const getChapters = async (
  storyId: string
): Promise<{ success: boolean; data: Chapter[] }> => {
  const { data } = await api.get(`/stories/${storyId}/chapters`);
  return data;
};

export const getChapterById = async (
  storyId: string,
  chapterId: string
): Promise<{ success: boolean; data: Chapter }> => {
  const { data } = await api.get(`/stories/${storyId}/chapters/${chapterId}`);
  return data;
};

export const createChapter = async (
  storyId: string,
  chapter: { title: string; content: string }
) => {
  const { data } = await api.post(`/stories/${storyId}/chapters`, chapter);
  return data;
};

export const updateChapter = async (
  storyId: string,
  chapterId: string,
  chapter: { title?: string; content?: string }
) => {
  const { data } = await api.put(
    `/stories/${storyId}/chapters/${chapterId}`,
    chapter
  );
  return data;
};

export const deleteChapter = async (storyId: string, chapterId: string) => {
  const { data } = await api.delete(`/stories/${storyId}/chapters/${chapterId}`);
  return data;
};
