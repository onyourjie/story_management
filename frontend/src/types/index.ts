export interface Chapter {
  id: string;
  title: string;
  content: string;
  storyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Story {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  category: string;
  coverImage?: string | null;
  tags: string[];
  status: "Publish" | "Draft";
  createdAt: string;
  updatedAt: string;
  chapters?: Chapter[];
}

export interface StoryListQuery {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  success: boolean;
}

export const CATEGORIES = [
  "Teen Fiction",
  "Romance",
  "Fantasy",
  "Non Fiction",
  "Financial",
  "Technology",
  "Health",
  "Mystery",
  "Science Fiction",
  "Horror",
];

export const STATUSES = ["Publish", "Draft"];
