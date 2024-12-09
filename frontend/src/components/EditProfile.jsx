import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchGenres } from '../api'; // Import the fetchGenres function
import './EditProfile.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const API_URL = 'https://daisy-chain-6d6d9cb21bb4.herokuapp.com/api'; // Use your Heroku app URL

function EditProfile() {
  const [profile, setProfile] = useState({
    username: '',
    profile_picture: '',
    bio: '',
    favorite_genres: [],
    top_movies: [],
  });
  const [genres, setGenres] = useState([]);
  const [topMoviesDetails, setTopMoviesDetails] = useState([]);
  const [searchQueries, setSearchQueries] = useState(['', '', '', '', '']);
  const [searchResults, setSearchResults] = useState([[], [], [], [], []]);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const topMovies = response.data.top_movies || [];
        // Ensure there are always 5 slots for top movies
        while (topMovies.length < 5) {
          topMovies.push(null);
        }
        setProfile({
          username: response.data.username || '',
          profile_picture: response.data.profile_picture || '',
          bio: response.data.bio || '',
          favorite_genres: response.data.favorite_genres || [],
          top_movies: topMovies,
        });

        // Fetch movie details for top movies
        const movieDetails = await Promise.all(
          topMovies.map(async (movieId) => {
            if (movieId) {
              const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                params: {
                  api_key: '8feb4db25b7185d740785fc6b6f0e850',
                },
              });
              return movieResponse.data;
            }
            return null;
          })
        );
        setTopMoviesDetails(movieDetails);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const loadGenres = async () => {
      try {
        const genreList = await fetchGenres();
        setGenres(genreList);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchProfile();
    loadGenres();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setProfile((prevProfile) => {
      const newFavoriteGenres = checked
        ? [...prevProfile.favorite_genres, value]
        : prevProfile.favorite_genres.filter((genre) => genre !== value);
      return {
        ...prevProfile,
        favorite_genres: newFavoriteGenres,
      };
    });
  };

  const handleSearchChange = (index, e) => {
    const { value } = e.target;
    setSearchQueries((prevQueries) => {
      const newQueries = [...prevQueries];
      newQueries[index] = value;
      return newQueries;
    });
  };

  const handleSearchSubmit = async (index, e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: '8feb4db25b7185d740785fc6b6f0e850',
          query: searchQueries[index],
        },
      });
      setSearchResults((prevResults) => {
        const newResults = [...prevResults];
        newResults[index] = response.data.results;
        return newResults;
      });
    } catch (error) {
      console.error('Error searching for movies:', error);
    }
  };

  const handleTopMoviesChange = (index, movie) => {
    setProfile((prevProfile) => {
      const newTopMovies = [...prevProfile.top_movies];
      if (movie) {
        newTopMovies[index] = movie.id;
      } else {
        newTopMovies[index] = null;
      }
      return {
        ...prevProfile,
        top_movies: newTopMovies,
      };
    });

    setTopMoviesDetails((prevDetails) => {
      const newDetails = [...prevDetails];
      if (movie) {
        newDetails[index] = movie;
      } else {
        newDetails[index] = null;
      }
      return newDetails;
    });

    // Clear the search results for the corresponding index
    setSearchResults((prevResults) => {
      const newResults = [...prevResults];
      newResults[index] = [];
      return newResults;
    });

    // Clear the search query for the corresponding index
    setSearchQueries((prevQueries) => {
      const newQueries = [...prevQueries];
      newQueries[index] = '';
      return newQueries;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/users/profile`, profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Profile updated successfully');
      navigate(`/user/${profile.username}`); // Navigate to the UserPage after saving changes
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="edit-profile">
      <ToastContainer />
      <div className="form-container">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Profile Picture URL</label>
            <input
              type="text"
              name="profile_picture"
              value={profile.profile_picture || ''}
              onChange={handleInputChange}
              className="form-control"
            />
            {profile.profile_picture && (
              <div className="profile-picture-preview">
                <img src={profile.profile_picture} alt="Profile" />
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={profile.bio || ''}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Favorite Genres</label>
            <div className="genres">
              {genres.map((genre) => (
                <div key={genre.id} className="form-check form-check-inline">
                  <input
                    type="checkbox"
                    id={`genre-${genre.id}`}
                    value={genre.name}
                    checked={profile.favorite_genres.includes(genre.name)}
                    onChange={handleGenreChange}
                    className="form-check-input"
                  />
                  <label htmlFor={`genre-${genre.id}`} className="form-check-label">{genre.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Top 5 Movies</label>
            {profile.top_movies.map((movieId, index) => (
              <div key={index} className="top-movie mb-3">
                <div className="search-form mb-2">
                  <input
                    type="text"
                    value={searchQueries[index] || ''}
                    onChange={(e) => handleSearchChange(index, e)}
                    placeholder={`Search for movie ${index + 1}`}
                    className="form-control"
                  />
                  <button type="button" onClick={(e) => handleSearchSubmit(index, e)} className="btn btn-primary mt-2">Search</button>
                </div>
                <div className="search-results">
                  {searchResults[index].map((result) => (
                    <div key={result.id} className="search-result">
                      <img src={`https://image.tmdb.org/t/p/w200/${result.poster_path}`} alt={result.title} />
                      <button type="button" onClick={() => handleTopMoviesChange(index, result)} className="btn btn-secondary mt-2">
                        {profile.top_movies.includes(result.id) ? 'Remove' : 'Add'}
                      </button>
                    </div>
                  ))}
                </div>
                {topMoviesDetails[index] && (
                  <div className="selected-movie mt-2">
                    <img src={`https://image.tmdb.org/t/p/w200/${topMoviesDetails[index].poster_path}`} alt={topMoviesDetails[index].title} />
                    <span>{index + 1}. {topMoviesDetails[index].title}</span>
                    <button type="button" onClick={() => handleTopMoviesChange(index, null)} className="btn btn-danger ml-2">Remove</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-100">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;