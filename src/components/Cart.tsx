import { useContext } from 'react';
import { useCart, useCartDispatch } from '../context/CartContext';
import './Cart.css';
import { Product } from '../apiService';
import { CurrencyContext } from '../components/CurrencyDetector';

export const Cart = () => {
  const { state } = useCart();
  const dispatch = useCartDispatch();
  const { currency, convertPrice } = useContext(CurrencyContext); // Use currency and convertPrice from context

  const decrementQuantity = (itemId: string) => {
    dispatch({ type: 'DECREMENT_QUANTITY', payload: itemId });
  };

  const incrementQuantity = (itemId: string) => {
    dispatch({ type: 'INCREMENT_QUANTITY', payload: itemId });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const normalizeCartItems = (items: Product[]): Product[] => {
    return items.map(item => ({
      ...item,
      RowKey: item.RowKey,
      Name: item.Name,
      Price: item.Price ?? 0,
      ImageUrl: item.ImageUrl,
      quantity: item.quantity ?? 1,
      size: item.size ?? 'default-size'
    }));
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

  console.log('Current cart items:', state.items);

  return (
    <div className="cart-product-container">
      {state.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-items-container">
          {normalizeCartItems(state.items).map((item) => {
            const convertedPrice = convertPrice(item.Price); // Convert price to the user's currency
            return (
              <div key={item.RowKey} className="cart-item">
                <img src={item.ImageUrl} alt={item.Name} className="cart-item-image" />
                <div className="cart-item-details">
                  <p>{item.Name}</p>
                  <p>{item.size}</p>
                  <p>{currencySymbol}{convertedPrice.toFixed(2)}</p>
                  <div className="cart-item-actions">
                    <button onClick={() => decrementQuantity(item.RowKey)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => incrementQuantity(item.RowKey)}>+</button>
                    <button onClick={() => removeItem(item.RowKey)}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cart;
