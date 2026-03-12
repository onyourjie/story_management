import { Router } from "express";
import * as chapterController from "../controllers/chapter.controller";
import { chapterValidation } from "../middleware/validation";

const router = Router({ mergeParams: true });

router.get("/", chapterController.getChapters);
router.get("/:id", chapterController.getChapterById);
router.post("/", chapterValidation, chapterController.createChapter);
router.put("/:id", chapterController.updateChapter);
router.delete("/:id", chapterController.deleteChapter);

export default router;
