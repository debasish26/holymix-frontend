import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import "../main.css"
import Navbar from '../../components/Navbar';

const Search = () => {
    const { id } = useParams();
    const [searchDetails, setSearchDetails] = useState([]);

    useEffect(() => {
        const fetchSearch = async () => {
            try {
                const response = await axios.get(`https://api-aniwatch-wine.vercel.app/anime/search?q=${id}`);
                const fetchedSearch = response.data.animes.map(data => ({
                    id: data.id,
                    name: data.name,
                    poster: data.poster,
                    duration: data.duration,
                    type: data.type,
                    sub: data.episodes.sub,
                    dub: data.episodes.dub
                }));
                setSearchDetails(fetchedSearch);
                console.log("id", { id });
                console.log(fetchedSearch);
            } catch (error) {
                console.error('Error fetching slides:', error);
            }
        };
        fetchSearch();
    }, [id]);

    return (
        <div>
            <Navbar isHomePage={false} />
            <div className="content-container" style={{ paddingTop: '100px' }}> {/* Add padding top */}
                <h3>Search</h3>
                <div className="cards-notscroll">
                    {searchDetails.slice(0, 15).map((search) => (
                        <Link key={search.id} to={`/info/${search.id}`} className="card-notscroll" style={{ backgroundImage: `url(${search.poster})` }}>
                            <div className="card-content-notscroll">
                                <h3>{search.name}</h3>
                                <div className="card-info">
                                    <span className="card-status">{search.duration}</span>
                                    <span className="card-type">{search.type}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Search;
