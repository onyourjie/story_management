import { Request, Response, NextFunction } from "express";
import * as chapterService from "../services/chapter.service";
import { createError } from "../middleware/errorHandler";

export const getChapters = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const chapters = await chapterService.getChaptersByStoryId(String(req.params.storyId));
    res.json({ success: true, data: chapters });
  } catch (err) {
    next(err);
  }
};

export const getChapterById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const chapter = await chapterService.getChapterById(
      String(req.params.id),
      String(req.params.storyId)
    );
    if (!chapter) {
      return next(createError("Chapter not found", 404));
    }
    res.json({ success: true, data: chapter });
  } catch (err) {
    next(err);
  }
};

export const createChapter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const chapter = await chapterService.createChapter(
      String(req.params.storyId),
      req.body
    );
    if (!chapter) {
      return next(createError("Story not found", 404));
    }
    res.status(201).json({ success: true, data: chapter });
  } catch (err) {
    next(err);
  }
};

export const updateChapter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const chapter = await chapterService.updateChapter(
      String(req.params.id),
      String(req.params.storyId),
      req.body
    );
    if (!chapter) {
      return next(createError("Chapter not found", 404));
    }
    res.json({ success: true, data: chapter });
  } catch (err) {
    next(err);
  }
};

export const deleteChapter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deleted = await chapterService.deleteChapter(
      String(req.params.id),
      String(req.params.storyId)
    );
    if (!deleted) {
      return next(createError("Chapter not found", 404));
    }
    res.json({ success: true, message: "Chapter deleted successfully" });
  } catch (err) {
    next(err);
  }
};
