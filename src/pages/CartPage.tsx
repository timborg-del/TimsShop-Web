import React, { useState, useContext } from 'react';
import Cart from '../components/Cart';
import PaypalStuff from '../components/PaypalStuff';
import './CartPage.css';
import { useCart } from '../context/CartContext';
import { CurrencyContext } from '../components/CurrencyDetector';

interface CartPageProps {
  isVisible: boolean;
  onClose: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ isVisible, onClose }) => {
  const { state } = useCart();
  const { currency, convertPrice } = useContext(CurrencyContext); // Use the currency and convertPrice from context
  const totalPriceInSEK = state.items.reduce((total, item) => total + item.Price * item.quantity, 0);
  const totalPrice = convertPrice(totalPriceInSEK); // Convert the total price to the user's currency
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsLeaving(false);
      onClose();
    }, 500); // Match the transition duration
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'GBP': '£',
      'EUR': '€',
      'SEK': 'kr',
      // Add more symbols as needed
    };
    return symbols[currency] || '';
  };

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className={`cart-page-container ${isVisible ? 'active' : ''} ${isLeaving ? 'leaving' : ''}`}>
      <div className='cart-page'>
        <button className="close-button-cart" onClick={handleClose}>&#x2192;</button>
        <div className='cart-content'>
          <div className='cart-container'>
            <Cart />
          </div>
          <div className='form-container'>
            <p className='total-price'>Total Price: {currencySymbol}{totalPrice.toFixed(2)}</p>
            <div className='paypal-buttons-container'>
              <PaypalStuff cart={state.items} />
            </div>
          </div>
        </div>
        <div className='information-section'>
          <h3>Brief on Shopping from Companies Outside the EU</h3>
          <p>You are required to pay customs duties and VAT on goods ordered from countries outside the EU. Additionally, the shipping company may charge a fee for handling your package and processing your customs declaration.</p>
          <p>When shopping from a country outside the EU, you are not always protected by EU consumer legislation. However, if the company targets Swedish consumers, Swedish laws often apply.</p>
          <p>If you have a dispute with a company outside the EU that targets Swedish consumers, the Swedish National Board for Consumer Disputes (ARN) may be able to handle your case.</p>
          <p>Keep in mind that goods permitted for sale in other countries may be prohibited in Sweden and that online goods may be counterfeit.</p>
          <p>Consumer legislation in the UK is very similar to the EU's, but you now need to pay import VAT and customs duties for goods over 124.12 GPB.</p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
