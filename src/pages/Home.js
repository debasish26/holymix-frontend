import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link , useNavigate } from 'react-router-dom';
import './main.css'; // Ensure you have the necessary styles in this CSS file
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import AnimeList from '../components/animelist';

const Home = () => {
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
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [trandingAnimes, setTrandingAnimes] = useState([]);
  const [topAiring, setTopAiring] = useState([])

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get('https://api-aniwatch-wine.vercel.app/anime/home');
        const fetchedSlides = response.data.spotlightAnimes.map(slide => ({
          id: slide.id,
          title: slide.name,
          description: slide.description,
          banner: slide.poster,
          image: slide.poster,
          tv: slide.otherInfo[0],
          duration: slide.otherInfo[1],
          release: slide.otherInfo[2],
          hd: slide.otherInfo[3]
        }));

        const trandingAnimes = response.data.trendingAnimes.map(data => ({
          id: data.id,
          name: data.name,
          poster: data.poster
        }))

        const topAiring = response.data.topAiringAnimes.map(data => ({
          id: data.id,
          name: data.name,
          poster: data.poster
        }))

        setSlides(fetchedSlides);
        setTrandingAnimes(trandingAnimes)
        setTopAiring(topAiring)

      } catch (error) {
        console.error('Error fetching slides:', error);
      }
    };

    fetchSlides();
  }, []);

  const nextSlide = () => {
    setActiveSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  const goToSlide = (index) => {
    setActiveSlide(index);
  };


  // Protect route access if not logged in
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

  // ... rest of your Home component code (slides, trending animes, etc.)
  return(
    <div>
  <Navbar isHomePage={true} />
  <div className="home">
    <div className="slideshow-container">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === activeSlide ? 'active' : 'inactive'}`}
          style={{
            backgroundImage: `url(${slide.banner})`,
            display: index === activeSlide ? 'block' : 'none'
          }}
        >
          <div className="slide-content">
            <h1 className='poppins-regular'>{slide.title.slice(0, 59) + "..."}</h1>
            <p style={{fontSize: "12px"}}>{slide.description.slice(0, 200)}...</p>
            <div className="slide-info" style={{    fontSize: "14px",
marginTop: "10px",}}>
              <span className="slide-genre tv"><i className="fas fa-play-circle mr-1"></i>{slide.tv}</span>
              <span className="slide-genre"><i className="fas fa-clock mr-1"></i>{slide.duration}</span>
              <span className="slide-genre"><i className="fas fa-calendar mr-1"></i>{slide.release}</span>
              <span className="slide-genre hd">{slide.hd}</span>
            </div>
            <div className='watch-btn' >
              <Link style={{fontSize: "12px"}} to={`/info/${slide.id}`} className="watch-btn btn btn-primary"><i className="fas fa-play-circle mr-1"></i>
                Watch Now
              </Link>
            </div>
          </div>
        </div>
      ))}
      <div className="dots-container">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === activeSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>

    <div className="cards-container">
      <h2 style={{fontSize: '18px'}}>Trending Animes</h2>
      <div className="cards-wrapper">
        <div className="cards">
          {trandingAnimes.map((slide) => (
            <Link key={slide.id} to={`/info/${slide.id}`} className="card" style={{ backgroundImage: `url(${slide.poster})` }}>
              <div className="card-content">
                <h3>{slide.name}</h3>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    <div className="cards-container-notscroll">
      <h2 style={{ fontSize: "18px"}}>Top Airing</h2>
      <div className="cards-notscroll">
        {topAiring.slice(0, 12).map((slide) => (
          <Link key={slide.id} to={`/info/${slide.id}`} className="card-notscroll" style={{ backgroundImage: `url(${slide.poster})` }}>
            <div className="card-content-notscroll">
              <h3>{slide.name}</h3>
              <div className="card-info">
                <span className="card-genre">{slide.genres}</span>
                <span className="card-status">{slide.status}</span>
                <span className="card-type">{slide.type}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
    <div className='anilist'>
      <AnimeList />
    </div>
  </div>
  <Footer />
</div>
  )
};

export default Home;
