import prisma from "../utils/prisma";
import { CreateChapterDto, UpdateChapterDto } from "../types";

export const getChaptersByStoryId = async (storyId: string) => {
  return prisma.chapter.findMany({
    where: { storyId },
    orderBy: { createdAt: "desc" },
  });
};

export const getChapterById = async (id: string, storyId: string) => {
  return prisma.chapter.findFirst({ where: { id, storyId } });
};

export const createChapter = async (storyId: string, dto: CreateChapterDto) => {
  const story = await prisma.story.findUnique({ where: { id: storyId } });
  if (!story) return null;

  return prisma.chapter.create({
    data: {
      title: dto.title,
      content: dto.content,
      storyId,
    },
  });
};

export const updateChapter = async (
  id: string,
  storyId: string,
  dto: UpdateChapterDto
) => {
  const existing = await prisma.chapter.findFirst({ where: { id, storyId } });
  if (!existing) return null;

  return prisma.chapter.update({
    where: { id },
    data: {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.content !== undefined && { content: dto.content }),
    },
  });
};

export const deleteChapter = async (
  id: string,
  storyId: string
): Promise<boolean> => {
  const existing = await prisma.chapter.findFirst({ where: { id, storyId } });
  if (!existing) return false;
  await prisma.chapter.delete({ where: { id } });
  return true;
};
