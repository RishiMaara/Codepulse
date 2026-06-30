import { Router } from "express";
import { body } from "express-validator";
import { login, refresh, getMe } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { authLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.post("/login",
  authLimiter,
  [body("email").isEmail().withMessage("Valid email required")],
  validate,
  login
);

router.post("/refresh", refresh);
router.get("/me", protect, getMe);

export default router;
