import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Watchlist.css'; // Ensure the correct CSS file is imported

const API_URL = 'https://daisy-chain-6d6d9cb21bb4.herokuapp.com/api'; // Use your Heroku app URL

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [currentlyWatching, setCurrentlyWatching] = useState(null);
  const [nextUp, setNextUp] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found in localStorage');
        }
        const response = await axios.get(`${API_URL}/watchlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWatchlist(response.data);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        setError('You must be logged in to view your watchlist.');
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after 3 seconds
        }, 3000);
      }
    };

    loadWatchlist();
  }, [navigate]);

  const handleRemove = async (movieId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/watchlist/remove/${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWatchlist(watchlist.filter((movie) => movie.movie_id !== movieId));
    } catch (error) {
      console.error('Failed to remove movie from watchlist:', error);
    }
  };

  const handleSetCurrentlyWatching = async (movieId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/watchlist/currently-watching/${movieId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const selectedMovie = watchlist.find((movie) => movie.movie_id === movieId);
      if (selectedMovie) {
        setWatchlist(watchlist.filter((movie) => movie.movie_id !== movieId));
        if (currentlyWatching && currentlyWatching.movie_id !== movieId) {
          setWatchlist((prevWatchlist) => [...prevWatchlist, currentlyWatching]);
        }
        setCurrentlyWatching(selectedMovie);
      } else {
        setCurrentlyWatching(null);
      }
    } catch (error) {
      console.error('Failed to set currently watching:', error);
    }
  };

  const handleSetNextUp = async (movieId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/watchlist/next-up/${movieId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const selectedMovie = watchlist.find((movie) => movie.movie_id === movieId);
      if (selectedMovie) {
        setWatchlist(watchlist.filter((movie) => movie.movie_id !== movieId));
        if (nextUp && nextUp.movie_id !== movieId) {
          setWatchlist((prevWatchlist) => [...prevWatchlist, nextUp]);
        }
        setNextUp(selectedMovie);
      } else {
        setNextUp(null);
      }
    } catch (error) {
      console.error('Failed to set next up:', error);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="watchlist">
      <h2>Your Watchlist</h2>
      <div className="movie-grid">
        {currentlyWatching && (
          <div className="movie-card first-spot">
            <Link to={`/movie/${currentlyWatching.movie_id}`}>
              <img src={`https://image.tmdb.org/t/p/w500/${currentlyWatching.poster}`} alt={currentlyWatching.title} />
              <h3>{currentlyWatching.title}</h3>
            </Link>
            <button onClick={() => handleSetCurrentlyWatching(null)}>Remove from Currently Watching</button>
          </div>
        )}
        {nextUp && (
          <div className="movie-card second-spot">
            <Link to={`/movie/${nextUp.movie_id}`}>
              <img src={`https://image.tmdb.org/t/p/w500/${nextUp.poster}`} alt={nextUp.title} />
              <h3>{nextUp.title}</h3>
            </Link>
            <button onClick={() => handleSetNextUp(null)}>Remove from Next Up</button>
          </div>
        )}
        {watchlist.map((movie) => (
          <div key={movie.movie_id} className="movie-card">
            <Link to={`/movie/${movie.movie_id}`}>
              <img src={`https://image.tmdb.org/t/p/w500/${movie.poster}`} alt={movie.title} />
              <h3>{movie.title}</h3>
            </Link>
            <button onClick={() => handleRemove(movie.movie_id)}>Remove</button>
            <div className="toggle-buttons">
              <button
                className={`toggle-button ${currentlyWatching && currentlyWatching.movie_id === movie.movie_id ? 'active' : ''}`}
                onClick={() => handleSetCurrentlyWatching(movie.movie_id)}
              >
                Currently Watching
              </button>
              <button
                className={`toggle-button ${nextUp && nextUp.movie_id === movie.movie_id ? 'active' : ''}`}
                onClick={() => handleSetNextUp(movie.movie_id)}
              >
                Next Up
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Watchlist;