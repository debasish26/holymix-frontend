import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// Genres Component
const genres = [
    'Action', 'Adventure', 'Cars', 'Comedy', 'Dementia', 'Demons', 'Drama', 'Ecchi',
    'Fantasy', 'Game', 'Harem', 'Historical', 'Horror', 'Isekai', 'Josei', 'Kids',
    'Magic', 'Martial Arts', 'Mecha', 'Military', 'Music', 'Mystery', 'Parody', 'Police'
];

const cardClasses = 'bg-zinc-900 p-4 rounded-lg max-w-sm mx-auto';
const titleClasses = 'text-pink-400 text-xl font-bold mb-4';
const gridClasses = 'bg-zinc-800 p-4 rounded-lg grid grid-cols-3 gap-4 text-sm';
const genreClasses = 'text-green-300 text-pink-400 text-red-400 text-purple-300 text-zinc-300 text-blue-300 text-teal-300';



// AnimeList Component
const AnimeList = () => {
    const [top10, setTop10] = useState([]);
    const [upcoming, setUpComing] = useState([]);
    const [latestEp, setLatestEp] = useState([]);
    const [genres, setGenres] = useState([])
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const response = await axios.get('https://api-aniwatch-wine.vercel.app/anime/home');

                const top10 = response.data.top10Animes.today.map(data => ({
                    id: data.id,
                    poster: data.poster,
                    name: data.name
                }));
                const upcoming = response.data.topUpcomingAnimes.map(data => ({
                    id: data.id,
                    name: data.name,
                    poster: data.poster
                }));
                const latest = response.data.latestEpisodeAnimes.map(data => ({
                    id: data.id,
                    name: data.name,
                    poster: data.poster
                }));
                const genres = response.data.genres;


                setTop10(top10);
                setUpComing(upcoming);
                setLatestEp(latest);
                setGenres(genres)
            } catch (error) {
                console.error('Error fetching slides:', error);
            }
        };
        fetchSlides();
    }, []);

    return (
        <div className="bg-zinc-900 text-white p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Top Airing */}
                <div>
                    <h2 className="text-pink-400 text-xl mb-4">Top Animes</h2>
                    <div className="space-y-4">
                        {top10.slice(0, 5).map((data) => (
                            <div key={data.id}>
                                <div className="flex items-start">
                                    <img src={data.poster} alt={data.name} className="w-16 h-20 object-cover rounded-md" />
                                    <div className="ml-4">
                                        <Link key={data.id} to={`/info/${data.id}`}>
                                            <h3 className="text-lg">{data.name}</h3>
                                        </Link>

                                        <div className="flex items-center space-x-2">
                                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">cc 1108</span>
                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">1073</span>
                                            <span className="text-zinc-400">• TV</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
                {/* End of Top Airing */}

                {/* Upcoming Animes */}
                <div>
                    <h2 className="text-pink-400 text-xl mb-4">Upcoming Animes</h2>
                    <div className="space-y-4">
                        {upcoming.slice(0, 5).map((data) => (
                            <div key={data.id} className="flex items-start">
                                <img src={data.poster} alt={data.name} className="w-16 h-20 object-cover rounded-md" />
                                <div className="ml-4">
                                    <Link key={data.id} to={`/info/${data.id}`}>
                                        <h3 className="text-lg">{data.name}</h3>
                                    </Link>

                                    <div className="flex items-center space-x-2">
                                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">cc 500</span>
                                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">500</span>
                                        <span className="bg-zinc-500 text-white text-xs px-2 py-1 rounded">500</span>
                                        <span className="text-zinc-400">• TV</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* End of Upcoming Animes */}

                {/* Latest Episode Animes */}
                <div>
                    <h2 className="text-pink-400 text-xl mb-4">Latest Episode Animes</h2>
                    <div className="space-y-4">
                        {latestEp.slice(0, 5).map((data) => (
                            <div key={data.id} className="flex items-start">
                                <img src={data.poster} alt={data.name} className="w-16 h-20 object-cover rounded-md" />
                                <div className="ml-4">
                                    <Link key={data.id} to={`/info/${data.id}`}>
                                        <h3 className="text-lg">{data.name}</h3>
                                    </Link>

                                    <div className="flex items-center space-x-2">
                                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">cc 12</span>
                                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">12</span>
                                        <span className="text-zinc-400">• TV</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* End of Latest Episode Animes */}

                {/* Genres */}
                <div>
                    <div className={cardClasses}>
                        <h2 className={titleClasses}>Genres</h2>
                        <div className={gridClasses}>
                            {genres.slice(0, 24).map((genre, index) => (
                                <Link to={`/genres/${genre}`} >
                                    <span key={index} className={genreClasses.split(' ')[index % 6]}>{genre}</span>

                                </Link>
                            ))}
                        </div>
                        <button className="bg-zinc-700 text-white w-full py-2 mt-4 rounded-lg">Show more</button>
                    </div>
                </div>
                {/* End of Genres */}
            </div>
        </div>
    );
}

export default AnimeList;
