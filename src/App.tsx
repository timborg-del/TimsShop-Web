import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import CartButton from './components/CartButton';
import { CartProvider } from './context/CartContext';
import ShopPage from './pages/ShopPage';
import About from './pages/About';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import ChangePassword from './components/ChangePassword';
import PrivateRoute from './components/PrivateRoute';
import CartPage from './pages/CartPage';
import ContactMe from './pages/ContactMe';
import ClosedPage from './pages/ClosedPage';


const App: React.FC = () => {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Toggle this to enable/disable the ClosedPage
  const isShopClosed = true; // Set to true to show ClosedPage, false for normal behavior

  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  const toggleMenuVisibility = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <CartProvider>
        <nav className="navbar">
          <div className="centerLinks">
            <button className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenuVisibility}>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
            </button>
            <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" className="contact-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <div
                className="dropdown"
                onMouseEnter={() => setIsShopOpen(true)}
                onMouseLeave={() => setIsShopOpen(false)}
              >
                <h1 className="h1shop">Shop</h1>
                <div className={`dropdownContent ${isShopOpen ? 'open' : ''}`}>
                  <Link to="/shoppage" onClick={() => setIsMenuOpen(false)}>Art-Prints</Link>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button className="cart-button" onClick={toggleCartVisibility}>
              <CartButton onClick={toggleCartVisibility} />
            </button>
          </div>
        </nav>

        <CartPage isVisible={isCartVisible} onClose={toggleCartVisibility} />

        <Routes>
          {isShopClosed ? (
            // If shop is closed, show ClosedPage for all routes
            <Route path="*" element={<ClosedPage />} />
          ) : (
            // Otherwise, render the original routes
            <>
              <Route path="/" element={<Home />} />
              <Route path="/shoppage" element={<ShopPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/change-password" element={<PrivateRoute component={ChangePassword} />} />
              <Route path="/admin" element={<PrivateRoute component={AdminPage} />} />
              <Route path="/contact" element={<ContactMe />} />
            </>
          )}
        </Routes>
      </CartProvider>
    </Router>
  );
};

export default App;

