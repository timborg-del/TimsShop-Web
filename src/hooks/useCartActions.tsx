import { useState } from 'react';
import { useCart, useCartDispatch } from '../context/CartContext';
import { Product } from '../apiService'; // Ensure this path is correct

const useCartActions = () => {
  const dispatch = useCartDispatch();
  const { state } = useCart();
  const [loading, setLoading] = useState(false);

  const addItemToCart = (item: Product) => {
    setLoading(true);
    setTimeout(() => {
      const existingItem = state.items.find(cartItem => cartItem.RowKey === item.RowKey && cartItem.size === item.size);
      
      if (existingItem) {
        dispatch({ type: 'INCREMENT_QUANTITY', payload: item.RowKey });
      } else {
        dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1, Price: item.Price ?? 0 } });
      }

      setLoading(false);
    }, 1000);
  };

  const removeItemFromCart = (itemId: string) => {
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
      setLoading(false);
    }, 1000);
  };

  const clearCart = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: 'CLEAR_CART' });
      setLoading(false);
    }, 1000);
  };

  return {
    cart: state,
    loading,
    addItemToCart,
    removeItemFromCart,
    clearCart,
  };
};

export default useCartActions;
















