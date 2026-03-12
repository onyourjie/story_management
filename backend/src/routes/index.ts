import { Router } from "express";
import storyRoutes from "./story.routes";
import chapterRoutes from "./chapter.routes";

const router = Router();

router.use("/stories", storyRoutes);
router.use("/stories/:storyId/chapters", chapterRoutes);

export default router;
