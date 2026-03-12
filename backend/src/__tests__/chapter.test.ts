import request from "supertest";
import app from "../index";
import prisma from "../utils/prisma";

let storyId: string;
let chapterId: string;

beforeAll(async () => {
  await prisma.chapter.deleteMany();
  await prisma.story.deleteMany();

  const story = await prisma.story.create({
    data: {
      title: "Chapter Test Story",
      author: "Author",
      synopsis: "Synopsis",
      category: "Fantasy",
      tags: "[]",
      status: "Draft",
    },
  });
  storyId = story.id;
});

afterAll(async () => {
  await prisma.chapter.deleteMany();
  await prisma.story.deleteMany();
  await prisma.$disconnect();
});

describe("Chapter API", () => {
  describe("POST /api/stories/:storyId/chapters", () => {
    it("should create a chapter", async () => {
      const res = await request(app)
        .post(`/api/stories/${storyId}/chapters`)
        .send({ title: "Chapter 1", content: "<p>Content here</p>" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Chapter 1");
      chapterId = res.body.data.id;
    });

    it("should return 400 for missing title", async () => {
      const res = await request(app)
        .post(`/api/stories/${storyId}/chapters`)
        .send({ content: "<p>No title</p>" });
      expect(res.status).toBe(400);
    });

    it("should return 404 for non-existent story", async () => {
      const res = await request(app)
        .post("/api/stories/non-existent/chapters")
        .send({ title: "Ch", content: "<p>text</p>" });
      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/stories/:storyId/chapters", () => {
    it("should return all chapters for a story", async () => {
      const res = await request(app).get(`/api/stories/${storyId}/chapters`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/stories/:storyId/chapters/:id", () => {
    it("should return a specific chapter", async () => {
      const res = await request(app).get(
        `/api/stories/${storyId}/chapters/${chapterId}`
      );
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(chapterId);
    });

    it("should return 404 for non-existent chapter", async () => {
      const res = await request(app).get(
        `/api/stories/${storyId}/chapters/bad-id`
      );
      expect(res.status).toBe(404);
    });
  });

  describe("PUT /api/stories/:storyId/chapters/:id", () => {
    it("should update a chapter", async () => {
      const res = await request(app)
        .put(`/api/stories/${storyId}/chapters/${chapterId}`)
        .send({ title: "Updated Chapter", content: "<p>Updated content</p>" });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("Updated Chapter");
    });
  });

  describe("DELETE /api/stories/:storyId/chapters/:id", () => {
    it("should delete a chapter", async () => {
      const res = await request(app).delete(
        `/api/stories/${storyId}/chapters/${chapterId}`
      );
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 404 for already deleted chapter", async () => {
      const res = await request(app).delete(
        `/api/stories/${storyId}/chapters/${chapterId}`
      );
      expect(res.status).toBe(404);
    });
  });
});
