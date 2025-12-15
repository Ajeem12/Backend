import { prisma } from "../config/db.js";

const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;

  // Verify Movie exists in the database
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  //Check if the movie is already in the user's watchlist
  const existingInWatchlist = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId,
      },
    },
  });

  if (existingInWatchlist) {
    return res.status(400).json({ error: "Movie already in watchlist" });
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
    },
  });

  res.status(201).json({ status: "success", data: { watchlistItem } });
};

const removeFromWatchlist = async (req, res) => {
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });
  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }
  if (watchlistItem.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "Not authorized to remove this watchlist item" });
  }
  await prisma.watchlistItem.delete({
    where: { id: req.params.id },
  });
  res
    .status(200)
    .json({ status: "success", message: "Movie removed from watchlist" });
};

const updateWatchlistItem = async (req, res) => {
  const { status, rating, notes } = req.body;

  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }

  if (watchlistItem.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "Not authorized to update this watchlist item" });
  }

  const updateData = {};
  if (status !== undefined) updateData.status = status.toUpperCase();
  if (rating !== undefined) updateData.rating = rating;
  if (notes !== undefined) updateData.notes = notes;

  const updatedWatchlistItem = await prisma.watchlistItem.update({
    where: { id: req.params.id },
    data: updateData,
  });

  res.status(200).json({ status: "success", data: { updatedWatchlistItem } });
};

export { addToWatchlist, removeFromWatchlist, updateWatchlistItem };
