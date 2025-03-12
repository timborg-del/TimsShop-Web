import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Product from '../components/Products'; // Ensure the correct path and file name for the Product component
import './ShopPage.css'; // Import the corresponding CSS file

const ShopPage: React.FC = () => {
  const location = useLocation();
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productName = params.get('product');
    if (productName) {
      setActiveProduct(productName);
    }
  }, [location]);

  useEffect(() => {
    // Trigger the transition after the component mounts
    setIsVisible(true);
  }, []);

  return (
    <div className={`shop-container ${isVisible ? 'visible' : ''}`}>
      <h1>Shop</h1>
      <Product activeProductName={activeProduct} />
    </div>
  );
};

export default ShopPage;
