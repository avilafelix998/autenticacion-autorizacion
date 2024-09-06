import { Router } from "express";
import {
  login,
  session,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { validarJwt } from "../middlewares/validar-jwt.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/session", validarJwt, session);
authRouter.post("/logout", logout);
