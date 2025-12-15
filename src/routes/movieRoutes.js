import express from "express";
import {
  addMovie,
  updateMovie,
  deleteMovie,
  getMovies,
  getMoviesByName,
} from "../controllers/moviesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMovies);

router.get("/search/:name", getMoviesByName);

router.post("/", addMovie);

router.put("/:id", updateMovie);

router.delete("/:id", deleteMovie);

export default router;
