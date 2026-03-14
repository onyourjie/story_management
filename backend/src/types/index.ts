export interface Story {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  category: string;
  coverImage?: string | null;
  tags: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  storyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStoryDto {
  title: string;
  author: string;
  synopsis: string;
  category: string;
  coverImage?: string;
  tags: string[];
  status: string;
  chapters?: CreateChapterDto[];
}

export interface UpdateStoryDto extends Partial<CreateStoryDto> {}

export interface CreateChapterDto {
  title: string;
  content: string;
}

export interface UpdateChapterDto extends Partial<CreateChapterDto> {}

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
}
