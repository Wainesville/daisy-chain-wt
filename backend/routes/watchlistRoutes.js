const express = require('express');
const { getWatchlist, addToWatchlist, getWatchlistByUserId, removeFromWatchlist, setCurrentlyWatching, setNextUp } = require('../controllers/watchlistController');
const authenticate = require('../middleware/authenticate'); // Authentication middleware

const router = express.Router();

router.get('/', authenticate, getWatchlist);
router.post('/', authenticate, addToWatchlist);
router.get('/:userId', authenticate, getWatchlistByUserId);
router.delete('/remove/:movieId', authenticate, removeFromWatchlist);
router.put('/currently-watching/:movieId', authenticate, setCurrentlyWatching);
router.put('/next-up/:movieId', authenticate, setNextUp);

module.exports = router;