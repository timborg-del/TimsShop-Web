import React, { useState, useEffect, useContext } from 'react';
import useCartActions from '../hooks/useCartActions';
import './Products.css';
import useFetchData from '../hooks/useFetchData';
import { Product, AdditionalImage, getAdditionalImages } from '../apiService';
import { useCart, useCartDispatch } from '../context/CartContext';
import { CurrencyContext } from '../components/CurrencyDetector';
import CartPage from 'src/pages/CartPage';
import CartButton from '../components/CartButton';

interface ProductsProps {
  activeProductName: string | null;
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
const Products: React.FC<ProductsProps> = ({ activeProductName }) => {
  const { addItemToCart } = useCartActions();
  const { data: products, isLoading, error } = useFetchData<Product[]>(`${API_BASE_URL}/GetProducts`);
  const [additionalImages, setAdditionalImages] = useState<AdditionalImage[]>([]);
  const [activeProduct, setActiveProduct] = useState<string | null>(activeProductName);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showScrollable, setShowScrollable] = useState<boolean>(false);
  const { state } = useCart();
  const dispatch = useCartDispatch();
  const { currency, setCurrency, convertPrice } = useContext(CurrencyContext);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  const toggleScrollable = () => {
    setShowScrollable(!showScrollable);
  };

  const priceAdjustments: { [key: string]: number } = {
    A3: 0,
    A4: -200,
    A5: -311,
    Large: -198,
    Small: -307,
  };

  useEffect(() => {
    if (activeProductName) {
      const product = products?.find((p) => p.Name === activeProductName);
      if (product) {
        setActiveProduct(product.RowKey);
      }
    }
  }, [activeProductName, products]);

  useEffect(() => {
    const fetchAdditionalImages = async () => {
      if (products && products.length > 0) {
        const allAdditionalImages = await Promise.all(
          products.map((product) => getAdditionalImages(product.Name))
        );
        setAdditionalImages(allAdditionalImages.flat());
        console.log('Fetched additional images:', allAdditionalImages.flat());
      }
    };

    fetchAdditionalImages();
  }, [products]);

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes({ ...selectedSizes, [productId]: size });
  };

  const getPrice = (productId: string, basePrice: number) => {
    const size = selectedSizes[productId] || 'A3';
    const adjustment = priceAdjustments[size] || 0;
    return basePrice + adjustment;
  };

  const handleAddToCart = (product: Product) => {
    const size = selectedSizes[product.RowKey] || 'A3';
    const uniqueId = `${product.RowKey}-${size}`;
    addItemToCart({
      ...product,
      RowKey: uniqueId,
      Price: getPrice(product.RowKey, product.Price),
      quantity: 1,
      size,
    });
  };

  const incrementQuantity = (product: Product) => {
    const size = selectedSizes[product.RowKey] || 'A3';
    const uniqueId = `${product.RowKey}-${size}`;
    const cartItem = state.items.find((item) => item.RowKey === uniqueId);
    if (cartItem) {
      dispatch({ type: 'INCREMENT_QUANTITY', payload: uniqueId });
    } else {
      addItemToCart(product);
    }
  };

  const decrementQuantity = (product: Product) => {
    const size = selectedSizes[product.RowKey] || 'A3';
    const uniqueId = `${product.RowKey}-${size}`;
    const cartItem = state.items.find((item) => item.RowKey === uniqueId);
    if (cartItem) {
      if (cartItem.quantity > 1) {
        dispatch({ type: 'DECREMENT_QUANTITY', payload: uniqueId });
      } else {
        dispatch({ type: 'REMOVE_ITEM', payload: uniqueId });
      }
    }
  };

  const getGalleryImages = (product: Product) => {
    const additionalImagesForProduct = additionalImages.filter((image) => image.ProductId === product.Name);
    const galleryImages = [product.ImageUrl, ...additionalImagesForProduct.map((image) => image.ImageUrl)];
    console.log(`Gallery images for ${product.Name}:`, galleryImages);
    return galleryImages;
  };

  const handleNextImage = () => {
    if (products) {
      const product = products.find((p) => p.RowKey === activeProduct);
      if (product) {
        const galleryImages = getGalleryImages(product);
        console.log(`Next Image: ${currentImageIndex + 1} of ${galleryImages.length}`, galleryImages);
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
      }
    }
  };

  const handlePreviousImage = () => {
    if (products) {
      const product = products.find((p) => p.RowKey === activeProduct);
      if (product) {
        const galleryImages = getGalleryImages(product);
        console.log(`Previous Image: ${currentImageIndex - 1} of ${galleryImages.length}`, galleryImages);
        setCurrentImageIndex((prevIndex) =>
          prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
        );
      }
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      GBP: '£',
      EUR: '€',
      SEK: 'kr',
    };
    return symbols[currency] || '';
  };

  const currencySymbol = getCurrencySymbol(currency);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error fetching products:", error);
    return <div>Error: {error.message}</div>;
  }

  if (!Array.isArray(products)) {
    console.error("Unexpected data format:", products);
    return <div>Error: Unexpected data format</div>;
  }

  // Group products by category
  const groupedProducts = products.reduce((acc: { [key: string]: Product[] }, product) => {
    if (!acc[product.Category]) {
      acc[product.Category] = [];
    }
    acc[product.Category].push(product);
    return acc;
  }, {});

  return (
    <div className="categories-container">
      {Object.entries(groupedProducts).map(([category, products]) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <div className="products-grid">
            {products.map((product) => {
              const size = selectedSizes[product.RowKey] || 'A3';
              const uniqueId = `${product.RowKey}-${size}`;
              const quantity = state.items.find((item) => item.RowKey === uniqueId)?.quantity ?? 0;
              const displayPrice = convertPrice(getPrice(product.RowKey, product.Price));

              return (
                <div
                  key={product.RowKey}
                  className={`product-wrapper ${activeProduct === product.RowKey ? 'active' : ''}`}
                >
                  <div className={`product-card ${activeProduct === product.RowKey ? 'active' : ''}`}>
                    {activeProduct === product.RowKey ? (
                      <>
                        <div className="close-button-details-container">
                          <button className="close-button-details" onClick={() => setActiveProduct(null)}>&times;
                          </button>
                        </div>
                        <div className="image-gallery-container">
                          <button className="gallery-nav-button" onClick={handlePreviousImage}>{"<"}</button>
                          <img
                            src={getGalleryImages(product)[currentImageIndex]}
                            alt={product.Name}
                            className="product-image"
/*                             onError={(e) => {
                              e.currentTarget.src = '/path/to/placeholder-image.jpg';
                              //console.error("Image load error", e);
                            }} */
                            onClick={() => setEnlargedImage(getGalleryImages(product)[currentImageIndex])}
                          />
                          <button className="gallery-nav-button" onClick={handleNextImage}>{">"}</button>
                        </div>
                      </>
                    ) : (
                      <div className="product-thumbnail" onClick={() => setActiveProduct(product.RowKey)}>
                        {product.ImageUrl ? (
                          <img
                            src={product.ImageUrl}
                            alt={product.Name}
                            className="product-image"
/*                             onError={(e) => {
                              e.currentTarget.src = '/path/to/placeholder-image.jpg';
                              //console.error("Image load error", e);
                            }} */
                          />
                        ) : (
                          <div className="no-image">No Image Available</div>
                        )}
                        <div className="product-name">{product.Name}</div>
                      </div>
                    )}
                    {activeProduct === product.RowKey && (
                      <div className="product-details-dropdown">
                        <div className="products-cart-button-container">
                          <div className="go-to-cart-text-container">
                            <span className="go-to-cart-text">Go to cart</span>
                          </div>
                          <button className="products-cart-button" onClick={toggleCartVisibility}>
                            <CartButton onClick={toggleCartVisibility} />
                            <span className="right-arrow"></span>
                          </button>
                        </div>
                        <div className="scrollable-container-button">
                          <button className="toggle-button" onClick={toggleScrollable}>
                            {showScrollable ? 'Hide Details' : 'Show Details'}
                          </button>
                        </div>
                        <div className="product-info">
                          <p><strong>Name:</strong> {product.Name}</p>
                          <p><strong>Price:</strong> {currencySymbol}{displayPrice.toFixed(2)}
                            <select
                              value={currency}
                              onChange={(e) => setCurrency(e.target.value)}
                              className="currency-selector"
                            >
                              
                            <option value="USD">USD</option>
                              <option value="GBP">GBP</option>
                              <option value="EUR">EUR</option>
                              <option value="SEK">SEK</option>
                            </select>
                          </p>
                          <p><strong>Category:</strong> {product.Category}</p>
                        </div>
                        <div className="select-container">
                          <label htmlFor={`size-${product.RowKey}`}>Size:</label>
                          <select
                            id={`size-${product.RowKey}`}
                            value={selectedSizes[product.RowKey] || 'A3'}
                            onChange={(e) => handleSizeChange(product.RowKey, e.target.value)}
                          >
                            <option value="A3">A3</option>
                            <option value="A4">A4</option>
                            <option value="A5">A5</option>
                            <option value="Large">Large 21*21cm</option>
                            <option value="Small">Small 15*15cm</option>
                          </select>
                        </div>
                        <div className="quantity-buy-container">
                          <div className={`quantity-controls ${quantity > 0 ? '' : 'hidden'}`}>
                            <button onClick={() => decrementQuantity(product)}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => incrementQuantity(product)}>+</button>
                          </div>
                          <div className="buy-btn-container">
                            <button className="buy-btn" onClick={() => handleAddToCart(product)}>
                              Add to Cart
                            </button>
                          </div>
                        </div>
                        <div className={`scrollable-container ${showScrollable ? 'show-scrollable-container' : ''}`}>
                          <button className="close-button-scrollable" onClick={toggleScrollable}>&times;</button>
                          <p>Giclée Art Print of a Gouache illustration.</p>
                          <hr/>
                          <p>Each print is printed on 230gsm archival matt paper. A super heavyweight premium matt coated paper with a card like feel.</p>
                          <p>prints come in sizes: A3, A4, A5, Large 21cm x 21cm and Small 15cm x 15cm.</p>
                          <p>Prints are posted in a a hardbacked kraft postage envelope. Including a recycled card backing board and a compostable cello bag. I try to be as environmentally conscious as I can.</p>
                          <p>Please note that colours may vary slightly from what is seen on screen. I did my best to match the photos to the print.</p>
                          <p>Frames and props are not included - this listing is for the print only.</p>
                          <hr/>
                          <p>Thank you so much for stopping by and for your support! I hope these prints bring you joy. Please don't hesitate to get in touch if you have any questions regarding any of the prints.</p>
                          <p>Best wishes,</p>
                          <p>Jo</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {enlargedImage && (
        <div className="enlarged-image-overlay" onClick={() => setEnlargedImage(null)}>
          <img src={enlargedImage} alt="Enlarged" className="enlarged-image" />
        </div>
      )}
      <CartPage isVisible={isCartVisible} onClose={toggleCartVisibility} />
    </div>
  );
};

export default Products;
