import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link ,useNavigate} from 'react-router-dom';
import '../main.css'; // Assuming your main CSS file is importing Tailwind CSS or similar utility classes
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';
import { MediaPlayer, MediaProvider,Track } from '@vidstack/react';
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr';

const sharedClasses = {
    textZinc400: 'text-zinc-400',
    textYellow500: 'text-yellow-500',
    bgYellow500: 'bg-yellow-500',
    bgZinc700: 'bg-zinc-700',
    textZinc900: 'text-zinc-900',
    textWhite: 'text-white',
    minHScreen: 'min-h-screen',
    flex: 'flex',
    flexCol: 'flex-col',
    itemsCenter: 'items-center',
    justifyCenter: 'justify-center',
    wFull: 'w-full',
    maxW4xl: 'max-w-4xl',
    aspect: 'aspect-w-16 aspect-h-9',
    textCenter: 'text-center',
    mt4: 'mt-4',
    flexCenter: 'flex justify-center',
    spaceX2: 'space-x-2',
    px4: 'px-4',
    py2: 'py-2',
    spaceY2: 'space-y-2',
    justifyBetween: 'justify-between',
    mb4: 'mb-4',
    roundedMd: 'rounded-md',
    maxWmd: 'max-w-md',
    mxAuto: 'mx-auto',
    relative: 'relative',
    flexGrow: 'flex-grow',
    absolute: 'absolute',
    left3: 'left-3',
    top3: 'top-3',
    ml2: 'ml-2',
    mr2: 'mr-2',
    w4: 'w-4',
    h4: 'h-4',
    w5: 'w-5',
    h5: 'h-5',
    purple600: 'bg-purple-600',
    bgZinc800: 'bg-zinc-800',
    bgZinc900: 'bg-zinc-900',
    p2: 'p-2',
    textWhite: 'text-white',
    roundedLG: 'rounded-lg',
    p2: 'p-2',
    flex: 'flex',
    itemsCenter: 'items-center',
    spaceX2: 'space-x-2',
    relative: 'relative',
    wFull: 'w-full',
    pl10: 'pl-10',
    absolute: 'absolute',
    left3: 'left-3',
    topHalf: 'top-1/2',
    transform: 'transform',
    translateYHalf: '-translate-y-1/2',
    grid: 'grid',
    gridCols5: 'grid-cols-5',
    gap2: 'gap-2',
    ariaHidden: 'aria-hidden',
};

const buttonClasses = 'px-4 py-2 rounded-lg';
const activeButtonClasses = 'bg-pink-400 text-black';
const inactiveButtonClasses = 'bg-zinc-700 text-zinc-300';

const cardClass = "bg-zinc-800 p-4 rounded";
const flexClass = "flex items-center";
const imgClass = "w-12 h-12 rounded-full mr-4";
const textClass = "text-zinc-400 text-sm";
const WatchPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ep = queryParams.get('ep');
    const [animeInfo, setAnimeInfo] = useState(null);
    const [selectedEpisode, setSelectedEpisode] = useState(`${id}?${ep}`);
    const [selectedSubServer, setSelectedSubServer] = useState('hd-1');
    const [selectedDubServer, setSelectedDubServer] = useState(null);
    const [servers, setServers] = useState({ sub: [], dub: [] });
    const [videoSrc, setVideoSrc] = useState('');
    const [captions, setCaptions] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [episodeRanges, setEpisodeRanges] = useState([]);
    const [episodesInRange, setEpisodesInRange] = useState([]);
    const [isGridLayout, setIsGridLayout] = useState(false); // New state for toggling layout
    const [charactersVoiceActors, setCharactersVoiceActors] = useState([]);
    const [relatedAnimes, setRelatedAnimes] = useState([]);
    const [thumbnail,setThumbnail] = useState('')
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
        const fetchServers = async () => {
            try {
                const response = await fetch(`https://api-aniwatch-wine.vercel.app/anime/servers?episodeId=${id}?ep=${ep}`);
                const data = await response.json();
                setServers(data);
            } catch (error) {
                console.error('Error fetching servers:', error);
            }
        };
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
        fetchServers();
    }, [id, ep]);

    useEffect(() => {
        const fetchVideoSrc = async () => {
            const server = selectedSubServer || selectedDubServer;
            if (server) {
                const category = selectedSubServer ? 'sub' : 'dub';
                try {
                    const response = await fetch(`https://api-aniwatch-wine.vercel.app/anime/episode-srcs?id=${id}?ep=${ep}&server=vidstreaming&category=${category}`);
                    const data = await response.json();
                    if (data.sources && data.sources.length > 0) {
                        setVideoSrc(data.sources[0].url);
                        setThumbnail(data.tracks[0].file);
                    }
                    if (data.tracks && data.tracks.length > 0) {
                        setCaptions(data.tracks);
                    }
                } catch (error) {
                    console.error('Error fetching video source:', error);
                }
            }
        };

        fetchVideoSrc();
    }, [selectedSubServer, selectedDubServer, id, ep]);

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                const response = await fetch(`https://api-aniwatch-wine.vercel.app/anime/episodes/${id}`);
                const data = await response.json();
                setEpisodes(data.episodes);
            } catch (error) {
                console.error('Error fetching episodes:', error);
            }
        };

        fetchEpisodes();
    }, [id]);

    useEffect(() => {
        if (episodes.length > 0) {
            const totalEpisodes = episodes.length;
            const ranges = [];
            let start = 1;
            let end = Math.min(10, totalEpisodes);
            while (start <= totalEpisodes) {
                ranges.push({ start, end });
                start = end + 1;
                end = Math.min(end + 10, totalEpisodes);
            }
            setEpisodeRanges(ranges);
            setEpisodesInRange(episodes.slice(0, 10));
        }
    }, [episodes]);

    const handleSubServerSelection = (server) => {
        setSelectedSubServer(server);
        setSelectedDubServer(null);
    };

    const handleDubServerSelection = (server) => {
        setSelectedDubServer(server);
        setSelectedSubServer(null);
    };

    const handleEpisodeClick = (episodeId) => {
        setSelectedEpisode(episodeId);
    };

    const toggleLayout = () => {
        setIsGridLayout(!isGridLayout);
    };
    if (!animeInfo) {
        return <div>Loading...</div>;
    }

    const { info, moreInfo } = animeInfo;
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
        <>
            <Navbar isHomePage={false} />
            <div className={`bg-zinc-900 ${sharedClasses.textWhite} ${sharedClasses.minHScreen} ${sharedClasses.flex} ${sharedClasses.flexCol} ${sharedClasses.itemsCenter} ${sharedClasses.justifyCenter}`} style={{ padding: "80px 0" }}>
                <div className="video-contain">
                    <div className="flex-1">
                        <div className={sharedClasses.aspect}>
                            
                            <MediaPlayer  src={videoSrc} style={{ width: '100%', height: '100%' }}>
                                <MediaProvider />
                                <PlyrLayout thumbnails={thumbnail} icons={plyrLayoutIcons} />
  {captions.map((caption, index) => (
                                    <Track
                                        key={index}
                                        src={caption.file}
                                        kind={caption.kind}
                                        label={caption.label}
                                        default={caption.default}
                                    />
                                ))}
                            </MediaPlayer>
                            

                        </div>
                        <div className="watch-container">
                            <div className="watch-info">
                                <p>You are watching</p>
                                <p className="font-bold">Wind Breaker Episode {parseInt(ep) + 1} English Subbed</p>
                                <p>If current server doesn't work please try other servers beside.</p>
                            </div>
                            <div className="video-controls">
                                <div className="flex items-center server-info space-x-2" style={{ margin: '5px' }}>
                                    <span className="flex items-center space-x-2">
                                        <i className="fas fa-closed-captioning mr-2"></i>
                                        <span>SUB:</span>
                                    </span>
                                    {servers.sub.slice(0, 4).map((server) => (
                                        <button
                                            key={server.serverId}
                                            className={`px-2 py-2 rounded-lg ${selectedSubServer === server.serverName ? 'active' : 'inactive'}`}
                                            onClick={() => handleSubServerSelection(server.serverName)}
                                        >
                                            {server.serverName}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex server-info items-center space-x-2">
                                    <span className="flex items-center space-x-2">
                                        <i className="fas fa-microphone-alt mr-2"></i>
                                        <span>DUB:</span>
                                    </span>
                                    {servers.dub.slice(0, 4).map((server) => (
                                        <button
                                            key={server.serverId}
                                            className={`px-2 py-2 rounded-lg ${selectedDubServer === server.serverName ? 'active' : 'inactive'}`}
                                            onClick={() => handleDubServerSelection(server.serverName)}
                                        >
                                            {server.serverName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className=" ml-4 episode-data">
                        <div className={`${sharedClasses.p2} ${sharedClasses.bgZinc900} ${sharedClasses.textWhite} ${sharedClasses.maxWmd} ${sharedClasses.mxAuto}`}>
                            <div className={`${sharedClasses.flex} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}>
                                <select
                                    className={`${sharedClasses.bgZinc800} ${sharedClasses.textWhite} ${sharedClasses.p2} ${sharedClasses.roundedMd} ${sharedClasses.mr2}`}
                                    onChange={(e) => {
                                        const selectedRangeIndex = parseInt(e.target.value);
                                        const selectedRange = episodeRanges[selectedRangeIndex];
                                        setSelectedEpisode(null);
                                        setEpisodesInRange(episodes.slice(selectedRange.start - 1, selectedRange.end));
                                    }}
                                >
                                    {episodeRanges.map((range, index) => (
                                        <option key={index} value={index}>
                                            Episodes {range.start} - {range.end}
                                        </option>
                                    ))}
                                </select>
                                <div className={`${sharedClasses.relative} ${sharedClasses.flexGrow}`}>
                                    <input type="text" placeholder="Filter episodes..." className={`${sharedClasses.bgZinc800} ${sharedClasses.textWhite} ${sharedClasses.p2} ${sharedClasses.pl10} ${sharedClasses.roundedMd} ${sharedClasses.wFull}`} />
                                </div>
                                <button onClick={toggleLayout} className={`${sharedClasses.bgZinc800} ${sharedClasses.p2} ${sharedClasses.roundedMd} ${sharedClasses.ml2}`}>
                                    <svg className={`${sharedClasses.w5} ${sharedClasses.h5} ${sharedClasses.textWhite}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 3a1 1 0 000 2h12a1 1 0 100-2H4zM3 9a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM4 15a1 1 0 100 2h12a1 1 0 100-2H4z"></path>
                                    </svg>
                                </button>
                            </div>
                            {isGridLayout ? (
                                <div className={`${sharedClasses.textWhite} ${sharedClasses.roundedLG} ${sharedClasses.spaceY4} p-4`}>
                                    <div className={`${sharedClasses.grid} ${sharedClasses.gridCols5} ${sharedClasses.gap2}`}>
                                        {episodesInRange.map((episode, index) => (
                                            <Link
                                                key={index}
                                                to={`/watch/${episode.episodeId}`}



                                                className={`${selectedEpisode === `${episode.episodeId}?${episode.ep}` ? sharedClasses.purple600 : sharedClasses.bgZinc800} ${sharedClasses.p2} ${sharedClasses.roundedMd}`}
                                                style={{ position: 'relative' }}

                                                onClick={() => handleEpisodeClick(`${episode.episodeId}?${episode.ep}`)}

                                            >
                                                {selectedEpisode === `${episode.episodeId}?${episode.ep}` && (
                                                    <div className={`${sharedClasses.bgYellow500} ${sharedClasses.w1} ${sharedClasses.hFull} ${sharedClasses.absolute} ${sharedClasses.left0}`} />
                                                )}
                                                <span className="ml-2">{episode.number}</span>

                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <ul className={sharedClasses.spaceY2}>
                                    {episodesInRange.map((episode, index) => (
                                        <li key={episode.id} className={`${selectedEpisode === `${episode.episodeId}?${episode.ep}` ? sharedClasses.purple600 : sharedClasses.bgZinc800} ${sharedClasses.p2} ${sharedClasses.roundedMd}`} style={{ border: selectedEpisode === `${episode.episodeId}?${episode.ep}` ? '2px solid yellow' : 'none' }}>
                                            <Link
                                                to={`/watch/${episode.episodeId}`}
                                                className={`${sharedClasses.flex} ${sharedClasses.itemsCenter} ${sharedClasses.textWhite}`}
                                                onClick={() => handleEpisodeClick(`${episode.episodeId}?${episode.ep}`)}
                                            >
                                                {selectedEpisode === `${episode.episodeId}?${episode.ep}` && <div className={`${sharedClasses.bgYellow500} ${sharedClasses.w1} ${sharedClasses.hFull} ${sharedClasses.absolute} ${sharedClasses.left0}`} />}
                                                <span className="ml-2">{episode.number}.</span>
                                                <span className="ml-2">{episode.title}</span>
                                                {selectedEpisode === `${episode.episodeId}?${episode.ep}` && (
                                                    <svg className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M14.596 10.532l-8 5A1 1 0 0 1 5 15V5a1 1 0 0 1 1.596-.804l8 5a1 1 0 0 1 0 1.606z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
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
                                        <p className="mt-2">{video.title.slice(0,10)}..</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-pink-400 text-xl mb-4">Recommended for you</h2>
                            <div className="cards-notscroll">
                                {relatedAnimes.slice(0,8).map((data) => (
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
                            {relatedAnimes.slice(0,16).map((data) => (
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

        </>
    );
};

export default WatchPage;
