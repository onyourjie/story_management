import request from "supertest";
import app from "../index";
import prisma from "../utils/prisma";

const cleanupStoryIds: string[] = [];

afterAll(async () => {
  if (cleanupStoryIds.length > 0) {
    await prisma.chapter.deleteMany({
      where: { storyId: { in: cleanupStoryIds } },
    });
    await prisma.story.deleteMany({
      where: { id: { in: cleanupStoryIds } },
    });
  }
  await prisma.$disconnect();
});

describe("Story API", () => {
  let createdStoryId: string;

  describe("POST /api/stories", () => {
    it("should create a new story", async () => {
      const res = await request(app)
        .post("/api/stories")
        .field("title", "Test Story")
        .field("author", "Test Author")
        .field("synopsis", "Test synopsis")
        .field("category", "Fantasy")
        .field("status", "Draft")
        .field("tags", JSON.stringify(["tag1", "tag2"]));

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Test Story");
      expect(res.body.data.author).toBe("Test Author");
      createdStoryId = res.body.data.id;
      cleanupStoryIds.push(createdStoryId);
    });

    it("should create a story with initial chapters", async () => {
      const chapters = [
        { title: "Chapter A", content: "<p>Chapter A Content</p>" },
        { title: "Chapter B", content: "<p>Chapter B Content</p>" },
      ];

      const res = await request(app)
        .post("/api/stories")
        .field("title", "Story With Chapters")
        .field("author", "Test Author")
        .field("synopsis", "Test synopsis with chapters")
        .field("category", "Fantasy")
        .field("status", "Draft")
        .field("tags", JSON.stringify(["chapter"]))
        .field("chapters", JSON.stringify(chapters));

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.chapters)).toBe(true);
      expect(res.body.data.chapters.length).toBe(2);
      expect(res.body.data.chapters[0].title).toBeDefined();
      cleanupStoryIds.push(res.body.data.id);
    });

    it("should return 400 for missing required fields", async () => {
      const res = await request(app)
        .post("/api/stories")
        .field("title", "Incomplete Story");

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/stories", () => {
    it("should return paginated stories", async () => {
      const res = await request(app).get("/api/stories");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body).toHaveProperty("total");
      expect(res.body).toHaveProperty("page");
    });

    it("should filter stories by status", async () => {
      const res = await request(app).get("/api/stories?status=Draft");
      expect(res.status).toBe(200);
      res.body.data.forEach((story: any) => {
        expect(story.status).toBe("Draft");
      });
    });

    it("should search stories by title", async () => {
      const res = await request(app).get("/api/stories?search=Test Story");
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/stories/:id", () => {
    it("should return a story by id", async () => {
      const res = await request(app).get(`/api/stories/${createdStoryId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdStoryId);
    });

    it("should return 404 for non-existent story", async () => {
      const res = await request(app).get("/api/stories/non-existent-id");
      expect(res.status).toBe(404);
    });
  });

  describe("PUT /api/stories/:id", () => {
    it("should update a story", async () => {
      const res = await request(app)
        .put(`/api/stories/${createdStoryId}`)
        .field("title", "Updated Test Story")
        .field("author", "Updated Author")
        .field("synopsis", "Updated synopsis")
        .field("category", "Romance")
        .field("status", "Publish");

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("Updated Test Story");
      expect(res.body.data.status).toBe("Publish");
    });
  });

  describe("GET /api/stories/stats", () => {
    it("should return story statistics", async () => {
      const res = await request(app).get("/api/stories/stats");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("totalStories");
      expect(res.body.data).toHaveProperty("publishedStories");
      expect(res.body.data).toHaveProperty("draftStories");
    });
  });

  describe("DELETE /api/stories/:id", () => {
    it("should delete a story", async () => {
      const res = await request(app).delete(`/api/stories/${createdStoryId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 404 for already deleted story", async () => {
      const res = await request(app).delete(`/api/stories/${createdStoryId}`);
      expect(res.status).toBe(404);
    });
  });
});
