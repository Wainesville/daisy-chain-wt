import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalWrapper from './ModalWrapper';
import MovieInfo from './MovieInfo';
import Badge from 'react-bootstrap/Badge';
import './UserPage.css';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '8feb4db25b7185d740785fc6b6f0e850';
const API_URL = 'https://daisy-chain-6d6d9cb21bb4.herokuapp.com/api'; // Use your Heroku app URL

const UserPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const defaultProfilePicture = 'https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png'; // Default image URL

  useEffect(() => {
    console.log('UserPage received username:', username);

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          window.location.href = '/login'; // Redirect to login page
          return;
        }
        const userResponse = await axios.get(`${API_URL}/users/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched user data:', userResponse.data);
        setUser(userResponse.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data : error.message);
      }
    };

    if (username) {
      fetchUserData();
    } else {
      setError('Username is undefined');
    }
  }, [username]);

  const handleMovieClick = (movieId) => {
    setSelectedMovieId(movieId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMovieId(null);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-page">
      <div className="user-info">
        <img src={user.profilePicture || defaultProfilePicture} alt={`${user.username}'s profile`} />
        <h2>{user.username}</h2>
        <p>{user.bio}</p>
        <Badge bg="primary">{user.role}</Badge>
      </div>
      <div className="user-watchlist">
        <h3>Watchlist</h3>
        <ul>
          {user.watchlist && user.watchlist.length > 0 ? (
            user.watchlist.map((movie) => (
              <li key={movie.id} onClick={() => handleMovieClick(movie.id)}>
                {movie.title}
              </li>
            ))
          ) : (
            <li>No movies in your watchlist.</li>
          )}
        </ul>
      </div>
      {isModalOpen && (
        <ModalWrapper onClose={handleModalClose}>
          <MovieInfo movieId={selectedMovieId} />
        </ModalWrapper>
      )}
    </div>
  );
};

export default UserPage;