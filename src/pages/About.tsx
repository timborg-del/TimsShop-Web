import { useEffect, useState } from 'react';
import './About.css'; // Import CSS file for About page styles

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the transition after the component mounts
    setIsVisible(true);
  }, []);

  return (
    <div className={`about-container ${isVisible ? 'visible' : ''}`}>
      <h2>About Me</h2>
      <div className="about-content">
        <p>Hello and Welcome! My name is JoAnne Salmon, but you can call me Jo 😊 I am an illustrator and animator with a love for all things creative. I have a background as an animator, storyboard artist and concept artist and have worked in the animation industry for many years. I am now embarking on new adventures.</p>
        <p>I create my artwork in various styles and techniques such as traditional and digital. I love painting with watercolour, acrylic gouache, and ink. I am always wanting to try new things and explore new works of art. I am based in the UK and all the art works are printed here. My landlord’s cat Margo is the floor manager and makes sure everything is running smoothly and all is in excellent quality. Thank you for stopping by! Lots of Love! Jo and Margo.</p>
        <div className="video-container">
          <iframe width="300" height="300" src="https://www.youtube.com/embed/pmB7unlc-3w" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      </div>
    </div>
  );
};

export default About;
