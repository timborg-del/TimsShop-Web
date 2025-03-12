import React from 'react';
import './ClosedPage.css'; // Import CSS for ClosedPage styles

const ClosedPage: React.FC = () => {
  return (
    <div className="closed-page">
      <div className="closed-content">
        <h1>My Shop is Temporarily Closed</h1>
        <p>We're making improvements to serve you better. Please check back soon!</p>
        <img 
          src="https://example.com/closed-shop-image.png" 
          alt="Temporarily Closed" 
          className="closed-image"
        />
        <p>Thank you for your patience and understanding.</p>
      </div>
    </div>
  );
};

export default ClosedPage;
