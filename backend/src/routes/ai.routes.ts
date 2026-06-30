import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  getWeakTopics,
  getRecommendationsForUser,
  getRoadmapForUser,
  getReadiness,
  getInterviewQuestions,
} from "../controllers/ai.controller";

const router = Router();

router.get("/weak-topics",    protect, getWeakTopics);
router.get("/recommendations", protect, getRecommendationsForUser);
router.get("/roadmap",         protect, getRoadmapForUser);
router.get("/readiness",       protect, getReadiness);
router.get("/interview",       protect, getInterviewQuestions);

export default router;
