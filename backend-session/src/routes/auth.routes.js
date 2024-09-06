import { Router } from "express";
import {
  login,
  logout,
  register,
  session,
} from "../controllers/auth.controllers.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/session", session);
authRouter.post("/logout", logout);
