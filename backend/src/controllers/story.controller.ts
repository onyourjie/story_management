import { Request, Response, NextFunction } from "express";
import * as storyService from "../services/story.service";
import { createError } from "../middleware/errorHandler";

export const getStories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await storyService.getStories(req.query as any);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getStoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const story = await storyService.getStoryById(String(req.params.id));
    if (!story) {
      return next(createError("Story not found", 404));
    }
    res.json({ success: true, data: story });
  } catch (err) {
    next(err);
  }
};

export const createStory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const coverImage = req.file ? req.file.path : undefined;

    let tags: string[] = [];
    if (req.body.tags) {
      try {
        tags = typeof req.body.tags === "string"
          ? JSON.parse(req.body.tags)
          : req.body.tags;
      } catch {
        tags = [];
      }
    }

    const story = await storyService.createStory({
      ...req.body,
      tags,
      coverImage,
    });
    res.status(201).json({ success: true, data: story });
  } catch (err) {
    next(err);
  }
};

export const updateStory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const coverImage = req.file ? req.file.path : req.body.coverImage;

    let tags: string[] | undefined;
    if (req.body.tags !== undefined) {
      try {
        tags = typeof req.body.tags === "string"
          ? JSON.parse(req.body.tags)
          : req.body.tags;
      } catch {
        tags = [];
      }
    }

    const story = await storyService.updateStory(String(req.params.id), {
      ...req.body,
      ...(tags !== undefined && { tags }),
      coverImage,
    });

    if (!story) {
      return next(createError("Story not found", 404));
    }
    res.json({ success: true, data: story });
  } catch (err) {
    next(err);
  }
};

export const deleteStory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deleted = await storyService.deleteStory(String(req.params.id));
    if (!deleted) {
      return next(createError("Story not found", 404));
    }
    res.json({ success: true, message: "Story deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const getStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await storyService.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};
