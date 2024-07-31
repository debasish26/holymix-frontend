import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import Footer from '../../components/Footer';
const AnimeDetails = () => {
    const [animeInfo, setAnimeInfo] = useState(null);
    const [charactersVoiceActors, setCharactersVoiceActors] = useState([]);
    const [relatedAnimes, setRelatedAnimes] = useState([]);
    const { id } = useParams();
    const [episodes, setEpisodes] = useState([]);
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
    useEffect(() => {
        const fetchAnimeInfo = async () => {
            try {
                const response = await axios.get(`https://api-aniwatch-wine.vercel.app/anime/info?id=${id}`);
                console.log('API Response:', response.data);

                const animeData = response.data.anime;
                setAnimeInfo(animeData);

                const characterDetails = animeData.info.charactersVoiceActors.map(data => ({
                    charId: data.character.id,
                    charImg: data.character.poster,
                    charName: data.character.name,
                    charCast: data.character.cast,
                    voiceActorId: data.voiceActor.id,
                    voiceActorImg: data.voiceActor.poster,
                    voiceActorName: data.voiceActor.name,
                    voiceActorCast: data.voiceActor.cast,
                }));

                setCharactersVoiceActors(characterDetails);

                // Fetch related anime data
                const relatedResponse = response.data.relatedAnimes;
                setRelatedAnimes(relatedResponse);
            } catch (error) {
                console.error('Error fetching anime info:', error);
            }
        };

        fetchAnimeInfo();
    }, [id]);

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                const response = await axios.get(`https://api-aniwatch-wine.vercel.app/anime/episodes/${id}`);
                setEpisodes(response.data.episodes);
            } catch (error) {
                console.error('Error fetching episodes:', error);
            }
        };

        if (id) {
            fetchEpisodes();
        }
    }, [id]);

    if (!animeInfo) {
        return <div>Loading...</div>;
    }

    const { info, moreInfo } = animeInfo;
    const firstEpisodeId = episodes.length > 0 ? episodes[0].episodeId : null;

    const cardClass = "bg-zinc-800 p-4 rounded";
    const flexClass = "flex items-center";
    const imgClass = "w-12 h-12 rounded-full mr-4";
    const textClass = "text-zinc-400 text-sm";
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
                            <button type="submit" className="submit-btn" >Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <>
            <Navbar isHomePage={false} />
            <div className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${info.poster})`, paddingTop: '60px' }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative flex flex-col md:flex-row p-4 md:p-8 lg:p-12 text-white">
                    <div className="md:w-1/3 lg:w-1/4">
                        <img src={info.poster} alt={info.name} className="rounded-lg shadow-lg" />
                    </div>
                    <div className="md:w-2/3 lg:w-3/4 md:pl-8 lg:pl-12">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-2">{info.name}</h1>
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="px-2 py-1 bg-zinc-700 rounded">{info.stats.quality}</span>
                            <span className="px-2 py-1 bg-zinc-700 rounded">EP {info.stats.episodes.sub}</span>
                            <span className="px-2 py-1 bg-zinc-700 rounded">{info.stats.type}</span>
                        </div>
                        <button className="font-bold py-2 px-4 rounded bg-yellow-400 text-black mb-4">
                            <Link to={`/watch/${firstEpisodeId}`} className="flex items-center">
                                Watch Now <i className="fas fa-play-circle ml-1"></i>
                            </Link>
                        </button>
                        <p className="text-sm lg:text-base mb-4">
                            {info.description.slice(0, 400)}...
                        </p>
                        <div className="bg-zinc-800 bg-opacity-75 p-4 rounded-lg mb-8">
                            <p><strong>Other Names:</strong> {moreInfo.japanese}</p>
                            <p><strong>Episodes:</strong> {info.stats.episodes.sub}</p>
                            <p><strong>Release Year:</strong> {moreInfo.aired}</p>
                            <p><strong>Type:</strong> {info.stats.type}</p>
                            <p><strong>Status:</strong> {moreInfo.status}</p>
                            <p><strong>Genres:</strong></p>
                            <div className="flex flex-wrap space-x-2 mt-2">
                                {moreInfo.genres.map(genre => (
                                    <span key={genre} className="px-2 py-1 bg-zinc-700 rounded">{genre}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-zinc-900 text-white p-6">
                <div className="grid grid-contain gap-4">
                    <div className="container-one">
                        <div>
                            <h2 className="text-pink-400 text-xl mb-4">Characters & Voice Actors</h2>
                            <div className="grid characters"> {/* Changed from grid-cols-2 to grid-cols-3 */}
                                {charactersVoiceActors.map((data) => (
                                    <React.Fragment key={data.charId}>
                                        <div className={`${flexClass} ${cardClass}`}>
                                            <img src={data.charImg} alt={data.charId} className={imgClass} />
                                            <div>
                                                <p>{data.charName}</p>
                                                <p className={textClass}>{data.charCast}</p>
                                            </div>
                                        </div>
                                        <div className={`${flexClass} ${cardClass}`}>
                                            <img src={data.voiceActorImg} alt={data.voiceActorId} className={imgClass} />
                                            <div>
                                                <p>{data.voiceActorName}</p>
                                                <p className={textClass}>{data.voiceActorCast}</p>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <div className="mt-8">
                            <h2 className="text-pink-400 text-xl mb-4">Promotion Videos</h2>
                            <div className="grid promotional-video"> {/* Changed grid-cols-4 to grid-cols-5 */}
                                {info.promotionalVideos.map((video, index) => (
                                    <div key={index} className={`${cardClass} ${flexClass} flex-col items-center`} style={{ width: '180px', height: '200px' }}> {/* Adjusted width */}
                                        <div className="relative w-full h-32">
                                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover rounded" />
                                            <a href={video.source} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center text-2xl text-white">
                                                ▶
                                            </a>
                                        </div>
                                        <p className="mt-2">{video.title.slice(0, 10)}..</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-pink-400 text-xl mb-4">Recommended for you</h2>
                            <div className="cards-notscroll">
                                {relatedAnimes.slice(0, 8).map((data) => (
                                    <Link key={data.id} to={`/info/${data.id}`} className="card-notscroll" style={{ backgroundImage: `url(${data.poster})` }}>
                                        <div className="card-content-notscroll">
                                            <h3>{data.name}</h3>
                                            <div className="card-info">
                                                <span className="card-genre">{data.genres}</span>
                                                <span className="card-status">{data.status}</span>
                                                <span className="card-type">{data.type}</span>
                                            </div>
                                        </div>
                                    </Link>

                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="container-two">
                        <h2 className="text-pink-400 text-xl mb-4">Related Anime</h2>
                        <div className="space-y-4">
                            {relatedAnimes.slice(0, 16).map((data) => (
                                <div key={data.id} className="flex items-start">
                                    <img src={data.poster} alt={data.name} className="w-16 h-20 object-cover rounded-md" />
                                    <div className="ml-4">
                                        <Link key={data.id} to={`/info/${data.id}`}>
                                            <h3 className="text-lg">{data.name}</h3>
                                        </Link>
                                        <div className="flex items-center space-x-2">
                                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">{data.type}</span>
                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">{data.episodes.sub} EP</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );

};

export default AnimeDetails;
