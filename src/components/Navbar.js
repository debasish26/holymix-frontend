import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file

const Navbar = ({ isHomePage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    if (isHomePage) {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      setScrolled(true);
    }
  }, [isHomePage]);

  useEffect(() => {
    const handleClickInsideMenu = (event) => {
      if (isMenuOpen && menuRef.current && menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('click', handleClickInsideMenu);

    return () => {
      window.removeEventListener('click', handleClickInsideMenu);
    };
  }, [isMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <div style={{
            display: "flex",
            flexDirection: "row-reverse"
          }}>
            <img src="/header.png" alt="Logo" className="navbar-logo" />
            <div className="navbar-menu-button">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="navbar-hamburger-button">
                <svg className="navbar-hamburger-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <ul className="navbar-links">
            <li>
              <Link to={`/`} className="navbar-link">Home</Link>
            </li>
            <li><a href="#" className="navbar-link">Movies</a></li>
            <li><a href="#" className="navbar-link">Genres</a></li>
            <li><a href="#" className="navbar-link">About</a></li>
          </ul>
        </div>
        <div className="navbar-right">
          <form onSubmit={handleSearch} className="navbar-search-form">
            <input
              type="text"
              placeholder="Search.."
              className="navbar-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="navbar-search-button">
              <svg className="navbar-search-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
          <button className="navbar-user-button">
            <svg className="navbar-user-icon" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9a2 2 0 114 0 2 2 0 01-4 0zm4 5a4 4 0 00-8 0h8z" />
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div ref={menuRef} className="navbar-mobile-menu">
          <div className="navbar-mobile-header" style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between"
          }}>
            <div style={{
              display: "flex",
              flexDirection: "row-reverse"
            }}>
              <img src="/header.png" alt="Logo" className="navbar-logo" />
              <button className="navbar-hamburger-button" onClick={() => setIsMenuOpen(false)}>
                <svg className="navbar-hamburger-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div>
              <form onSubmit={handleSearch} className="navbar-search-form">
                <input
                  type="text"
                  placeholder="Search.."
                  className="navbar-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="navbar-search-button">
                  <svg className="navbar-search-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
          <ul className="navbar-mobile-links">
            <li>
              <Link to={`/`} className="navbar-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </li>
            <li><a href="#" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Movies</a></li>
            <li><a href="#" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Genres</a></li>
            <li><a href="#" className="navbar-link" onClick={() => setIsMenuOpen(false)}>About</a></li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
