import React from 'react';
import { useCart } from '../context/CartContext';

interface CartButtonProps {
  onClick: () => void;
  className?: string; // Add a className prop for custom styling
}

const CartButton: React.FC<CartButtonProps> = ({ onClick, className }) => {
  const { cartItemCount } = useCart();

  return (
    <div className={`cart-button-container ${className}`} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-shopping-cart"
        width="50"
        height="50"
        viewBox="0 0 24 24"
        strokeWidth="1"
        stroke="white"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="17" cy="19" r="2" />
        <path d="M17 17h-11v-14h-2" />
        <path d="M6 5l14 1l-1 7h-13" />
      </svg>
      <span className='cart-counter'>{cartItemCount}</span>
    </div>
  );
};

export default CartButton;





