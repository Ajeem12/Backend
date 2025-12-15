import { prisma } from "../config/db.js";

const addMovie = async (req, res) => {
  try {
    const { title, overview, releaseYear, genres, runtime, posterUrl } =
      req.body;

    const userId = req.user.id;

    // basic validation
    if (
      !title ||
      !overview ||
      !releaseYear ||
      !genres ||
      !runtime ||
      !posterUrl
    ) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    if (!Array.isArray(genres)) {
      return res.status(400).json({
        status: "error",
        message: "genres must be an array",
      });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        overview,
        releaseYear: Number(releaseYear),
        genres,
        runtime: Number(runtime),
        posterUrl,
        createdBy: userId,
      },
    });

    return res.status(201).json({
      status: "success",
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const updateMovie = async (req, res) => {
  const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body;

  const movie = await prisma.movie.findUnique({
    where: { id: req.params.id },
  });

  if (!movie) {
    return res.status(404).json({
      status: "error",
      message: "Movie not found",
    });
  }

  if (movie.createdBy !== req.user.id) {
    return res.status(403).json({
      status: "error",
      message: "You are not authorized to update this movie",
    });
  }

  const updatedMovie = await prisma.movie.update({
    where: { id: req.params.id },
    data: {
      title,
      overview,
      releaseYear: Number(releaseYear),
      genres,
      runtime: Number(runtime),
      posterUrl,
    },
  });

  return res.status(200).json({
    status: "success",
    data: updatedMovie,
  });
};

const deleteMovie = async (req, res) => {
  const movie = await prisma.movie.findUnique({
    where: { id: req.params.id },
  });

  if (!movie) {
    return res.status(404).json({
      status: "error",
      message: "Movie not found",
    });
  }

  if (movie.createdBy !== req.user.id) {
    return res.status(403).json({
      status: "error",
      message: "You are not authorized to delete this movie",
    });
  }

  await prisma.movie.delete({
    where: { id: req.params.id },
  });

  return res.status(200).json({
    status: "success",
    message: "Movie deleted successfully",
    data: {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseYear: movie.releaseYear,
      genres: movie.genres,
      runtime: movie.runtime,
      posterUrl: movie.posterUrl,
    },
  });
};

const getMovies = async (req, res) => {
  const movies = await prisma.movie.findMany();
  return res.status(200).json({
    status: "success",
    data: movies,
  });
};

const getMoviesByName = async (req, res) => {
  const { name } = req.params;
  const movies = await prisma.movie.findMany({
    where: {
      title: {
        contains: name,
      },
    },
  });

  if (movies.length === 0) {
    return res.status(404).json({
      status: "error",
      message: "No movies found",
    });
  }

  return res.status(200).json({
    status: "success",
    data: movies,
  });
};

export { addMovie, updateMovie, deleteMovie, getMovies, getMoviesByName };
