import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateResult = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }
  next();
};

export const storyValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("author").trim().notEmpty().withMessage("Author is required"),
  body("synopsis").trim().notEmpty().withMessage("Synopsis is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("status")
    .isIn(["Publish", "Draft"])
    .withMessage("Status must be Publish or Draft"),
  validateResult,
];

export const chapterValidation = [
  body("title").trim().notEmpty().withMessage("Chapter title is required"),
  body("content").trim().notEmpty().withMessage("Chapter content is required"),
  validateResult,
];
