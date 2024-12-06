import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ViewUsers.css';

const API_URL = 'https://daisy-chain-6d6d9cb21bb4.herokuapp.com/api'; // Use your Heroku app URL

const ViewUsers = () => {
  const [newestUsers, setNewestUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const defaultProfilePicture = 'https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png'; // Default image URL

  useEffect(() => {
    const fetchNewestUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          window.location.href = '/login'; // Redirect to login page
          return;
        }
        const response = await axios.get(`${API_URL}/users/newest`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNewestUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch newest users:', err);
        setError('Failed to fetch newest users');
      }
    };

    fetchNewestUsers();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        window.location.href = '/login'; // Redirect to login page
        return;
      }
      const response = await axios.get(`${API_URL}/users/search?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(response.data);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed');
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="view-users-page">
      <h2>Newest Users</h2>
      <div className="user-grid">
        {newestUsers && newestUsers.length > 0 ? (
          newestUsers.map((user) => (
            <div key={user.id} className="user-card">
              <Link to={`/view-user/${user.username}`}>
                <img src={user.profile_picture || defaultProfilePicture} alt={`${user.username}'s profile`} />
                <h3>{user.username}</h3>
              </Link>
            </div>
          ))
        ) : (
          <p>No newest users found.</p>
        )}
      </div>
      <div className="search-section">
        <h2>Search Users</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((user) => (
              <div key={user.id} className="user-card">
                <Link to={`/view-user/${user.username}`}>
                  <img src={user.profile_picture || defaultProfilePicture} alt={`${user.username}'s profile`} />
                  <h3>{user.username}</h3>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUsers;