import prisma from "../utils/prisma";
import { CreateStoryDto, UpdateStoryDto, StoryListQuery, PaginatedResponse } from "../types";

const parseStory = (story: any) => ({
  ...story,
  tags: JSON.parse(story.tags || "[]"),
});

export const getStories = async (
  query: StoryListQuery
): Promise<PaginatedResponse<any>> => {
  const { search = "", category = "", status = "", page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { author: { contains: search } },
    ];
  }

  if (category) where.category = category;
  if (status) where.status = status;

  const [stories, total] = await Promise.all([
    prisma.story.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
      include: { chapters: { orderBy: { createdAt: "desc" } } },
    }),
    prisma.story.count({ where }),
  ]);

  return {
    data: stories.map(parseStory),
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  };
};

export const getStoryById = async (id: string) => {
  const story = await prisma.story.findUnique({
    where: { id },
    include: { chapters: { orderBy: { createdAt: "desc" } } },
  });
  if (!story) return null;
  return parseStory(story);
};

export const createStory = async (dto: CreateStoryDto) => {
  const chapters = (dto.chapters || []).filter(
    (chapter) => chapter.title?.trim() && chapter.content?.trim()
  );

  const story = await prisma.story.create({
    data: {
      title: dto.title,
      author: dto.author,
      synopsis: dto.synopsis,
      category: dto.category,
      coverImage: dto.coverImage || null,
      tags: JSON.stringify(dto.tags || []),
      status: dto.status,
      ...(chapters.length > 0 && {
        chapters: {
          create: chapters.map((chapter) => ({
            title: chapter.title,
            content: chapter.content,
          })),
        },
      }),
    },
    include: { chapters: { orderBy: { createdAt: "desc" } } },
  });
  return parseStory(story);
};

export const updateStory = async (id: string, dto: UpdateStoryDto) => {
  const existing = await prisma.story.findUnique({ where: { id } });
  if (!existing) return null;

  const story = await prisma.story.update({
    where: { id },
    data: {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.author !== undefined && { author: dto.author }),
      ...(dto.synopsis !== undefined && { synopsis: dto.synopsis }),
      ...(dto.category !== undefined && { category: dto.category }),
      ...(dto.coverImage !== undefined && { coverImage: dto.coverImage }),
      ...(dto.tags !== undefined && { tags: JSON.stringify(dto.tags) }),
      ...(dto.status !== undefined && { status: dto.status }),
    },
    include: { chapters: { orderBy: { createdAt: "desc" } } },
  });
  return parseStory(story);
};

export const deleteStory = async (id: string): Promise<boolean> => {
  const existing = await prisma.story.findUnique({ where: { id } });
  if (!existing) return false;
  await prisma.story.delete({ where: { id } });
  return true;
};

export const getStats = async () => {
  const [totalStories, publishedStories, draftStories, totalChapters] =
    await Promise.all([
      prisma.story.count(),
      prisma.story.count({ where: { status: "Publish" } }),
      prisma.story.count({ where: { status: "Draft" } }),
      prisma.chapter.count(),
    ]);
  return { totalStories, publishedStories, draftStories, totalChapters };
};
