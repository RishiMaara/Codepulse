import { Request, Response } from "express";
import User from "../models/User";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { logger } from "../utils/logger";

// ─── Email/Password Login (creates user if new) ───────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name: name || email.split("@")[0], email });
      logger.info(`New user created: ${email}`);
    }

    const payload = { id: user._id.toString(), role: user.role };
    const accessToken  = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.status(200).json({ success: true, accessToken, refreshToken, user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    logger.error(`Login error: ${message}`);
    const isDbError = /connection|mongo|ECONNRESET|closed/i.test(message);
    res.status(isDbError ? 503 : 500).json({
      success: false,
      message: isDbError
        ? "Database unavailable. Restart the backend or check MongoDB Atlas network access."
        : message,
    });
  }
};

// ─── Refresh Access Token ─────────────────────────────────────────────────────
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401).json({ success: false, message: "Refresh token required" });
      return;
    }
    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken({ id: decoded.id, role: decoded.role });
    res.json({ success: true, accessToken });
  } catch {
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};

// ─── Get Current User ─────────────────────────────────────────────────────────
export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).select("-__v");
    if (!user) { res.status(404).json({ success: false, message: "User not found" }); return; }
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
