import React from 'react';
import './main.css'; // Import the CSS file

const About = () => {
  return (
    <div className="about-container">
      <div className="image-wrapper">
        <img className="image" src="https://cdn.noitatnemucod.net/thumbnail/1366x768/100/db8603d2f4fa78e1c42f6cf829030a18.jpg" alt="Anime background" />
        <div className="gradient-bg"></div>
        <div className="tag-container">
          <span className="tag yellow">SUB</span>
          <span className="tag">EP 97</span>
        </div>
      </div>
      <div className="content">
        <h2 className="title">Chiikawa</h2>
      </div>
    </div>
  );
};

export default About;

