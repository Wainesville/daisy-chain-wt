import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from './config'; // Import the API_URL
import ModalWrapper from './ModalWrapper'; // Import the ModalWrapper component
import MovieInfo from './MovieInfo'; // Import the MovieInfo component
import Badge from 'react-bootstrap/Badge'; // Import Badge from react-bootstrap
import './UserPage.css'; // Reuse the UserPage.css styles

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '8feb4db25b7185d740785fc6b6f0e850';

const Browse = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genreMovies, setGenreMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
          params: {
            api_key: API_KEY,
          },
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
        setError('Failed to fetch genres');
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = async (genreId) => {
    setSelectedGenre(genreId);
    try {
      const response = await axios.get(`${BASE_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          with_genres: genreId,
        },
      });
      setGenreMovies(response.data.results);
    } catch (error) {
      console.error('Failed to fetch movies by genre:', error);
      setError('Failed to fetch movies by genre');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query: searchTerm,
        },
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Failed to search movies:', error);
      setError('Failed to search movies');
    }
  };

  const openModal = (movieId) => {
    setSelectedMovieId(movieId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovieId(null);
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="browse-page">
      <div className="genres">
        <h2>Genres</h2>
        <ul>
          {genres && genres.length > 0 ? (
            genres.map((genre) => (
              <li key={genre.id} onClick={() => handleGenreClick(genre.id)}>
                {genre.name}
              </li>
            ))
          ) : (
            <li>No genres available.</li>
          )}
        </ul>
      </div>
      <div className="movies">
        <h2>Movies</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for movies..."
          />
          <button type="submit">Search</button>
        </form>
        <div className="movie-grid">
          {searchResults.length > 0 ? (
            searchResults.map((movie) => (
              <div key={movie.id} className="movie-card" onClick={() => openModal(movie.id)}>
                <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
                <h3>{movie.title}</h3>
              </div>
            ))
          ) : genreMovies.length > 0 ? (
            genreMovies.map((movie) => (
              <div key={movie.id} className="movie-card" onClick={() => openModal(movie.id)}>
                <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
                <h3>{movie.title}</h3>
              </div>
            ))
          ) : (
            <p>No movies found.</p>
          )}
        </div>
      </div>
      <ModalWrapper isOpen={isModalOpen} onRequestClose={closeModal}>
        {selectedMovieId && <MovieInfo id={selectedMovieId} onClose={closeModal} />}
      </ModalWrapper>
    </div>
  );
};

export default Browse;