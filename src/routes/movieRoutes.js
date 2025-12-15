import express from "express";
import {
  addMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/moviesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// router.get("/");

router.post("/", addMovie);

router.put("/:id", updateMovie);

router.delete("/:id", deleteMovie);

export default router;
