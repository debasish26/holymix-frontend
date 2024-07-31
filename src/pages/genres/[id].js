
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link ,useNavigate} from 'react-router-dom';
import "../main.css"
const Genres = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const navigate = useNavigate();

  // Handle login form submission (replace with your login API call)
  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
  
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${apiUrl}/login`, { email, password });
      console.log('Response:', response.data); // Add this line to debug the response
  
      // Update this condition based on the actual response structure
      if (response.data.token) {
        setIsLoggedIn(true); // Update login state
        localStorage.setItem('token', response.data.token); // Store token in localStorage
        navigate('/'); // Redirect to home page after successful login
      } else {
        console.error('Login failed:', response.data.message);
        // Handle login failure (e.g., display error message)
      }
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle network or other errors (e.g., display error message)
    }
  };
  

  // Check login status on component mount or relevant event (e.g., token change)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Validate token on backend (if necessary)
      setIsLoggedIn(true); // Update login state based on valid token
    }
  }, []);
  const { id } = useParams();
  const [gendetails, setGenDetails] = useState([])
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`https://api-aniwatch-wine.vercel.app/anime/genre/${id}`);
        const fetchedGenre = response.data.animes.map(genre => ({
          id: genre.id,
          title: genre.name,
          image: genre.poster,
          tv: genre.type,
          duration: genre.duration,
          sub: genre.episodes.sub,
          dub: genre.episodes.dub
        }));

        setGenDetails(fetchedGenre)





      } catch (error) {
        console.error('Error fetching slides:', error);
      }
    };

    fetchGenres();
  }, []);
  if (!isLoggedIn) {
    return (

      <div className="flex-container">
      <div className="content-container">
        <div className="form-container login-container">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <br />
            <br />
            <span htmlFor="email" className="subtitle">USERNAME:</span>
            <br />
            <input type="email" id="email" name="email" required />
            <br />
            <span htmlFor="password" className="subtitle">PASSWORD:</span>
            <br />
            <input type="password" id="password" name="password" required />
            <br />
            <br />
            <button type="submit"className="submit-btn" >Submit</button>
          </form>
        </div>
      </div>
    </div>
    );
  }
  return (
    <div>

      <div className="cards-container-notscroll">
        <h2>{id}</h2>
        <div className="cards-notscroll">
          {gendetails.slice(0, 15).map((genre) => (
            <Link key={genre.id} to={`/info/${genre.id}`} className="card-notscroll" style={{ backgroundImage: `url(${genre.image})` }}>
              <div className="card-content-notscroll">
                <h3>{genre.title}</h3>
                <div className="card-info">
                  <span className="card-genre">{genre.genres}</span>
                  <span className="card-status">{genre.status}</span>
                  <span className="card-type">{genre.type}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Genres
