import { useEffect, useState } from 'react';
import '../pages/ContactMe.css'; // Import CSS file for Contact page styles

const ContactMe = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the transition after the component mounts
    setIsVisible(true);
  }, []);

  return (
    <div className={`contact-container ${isVisible ? 'visible' : ''}`}>
      <h2>Contact Me</h2>
      <div className="contact-content">
        <p>If you have any questions or inquiries, please feel free to reach out to me via email at: jo.salmonart@gmail.com</p>
      </div>
    </div>
  );
};

export default ContactMe;


