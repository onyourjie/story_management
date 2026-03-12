import { Router } from "express";
import * as storyController from "../controllers/story.controller";
import { upload } from "../config/multer";
import { storyValidation } from "../middleware/validation";

const router = Router();

router.get("/stats", storyController.getStats);
router.get("/", storyController.getStories);
router.get("/:id", storyController.getStoryById);
router.post("/", upload.single("coverImage"), storyValidation, storyController.createStory);
router.put("/:id", upload.single("coverImage"), storyValidation, storyController.updateStory);
router.delete("/:id", storyController.deleteStory);

export default router;
