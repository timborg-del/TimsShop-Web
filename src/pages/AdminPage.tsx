import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './AdminPage.css';
import { addProduct, getProducts, Product, updateProduct, deleteProduct, addShowroomImage, getShowroomImages, ShowroomImage, deleteShowroomImage, getAdditionalImages, addAdditionalImage, AdditionalImage, deleteAdditionalImage } from '../apiService';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    PartitionKey: 'product',
    RowKey: '',
    Name: '',
    Price: 0,
    Stock: 0,
    Category: '',
    ImageUrl: '',
    quantity: 0,
    size: '',
  });
  const [additionalImages, setAdditionalImages] = useState<AdditionalImage[]>([]);
  const [newAdditionalImage, setNewAdditionalImage] = useState<AdditionalImage>({
    PartitionKey: '',
    RowKey: '',
    ImageUrl: '',
    ProductId: ''
  });
  const [newShowroomImage, setNewShowroomImage] = useState<ShowroomImage>({
    PartitionKey: 'showroom',
    RowKey: '',
    Title: '',
    Description: '',
    ImageUrl: ''
  });
  const [showroomImages, setShowroomImages] = useState<ShowroomImage[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'products' | 'add' | 'edit' | 'showroom' | 'addShowroomImage' | 'additionalImages'>('dashboard');
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [, setToken] = useLocalStorage<string | null>('token', null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        if (Array.isArray(products)) {
          setProducts(products);
          console.log('Fetched products:', products);
        } else {
          setError('Unexpected data format');
        }
      } catch (err) {
        setError('Failed to fetch products');
      }
    };

    const fetchShowroomImages = async () => {
      try {
        const images = await getShowroomImages();
        setShowroomImages(images);
        console.log('Fetched showroom images:', images);
      } catch (err) {
        setError('Failed to fetch showroom images');
      }
    };

    fetchProducts();
    fetchShowroomImages();
  }, []);

  useEffect(() => {
    const fetchAdditionalImages = async () => {
      if (products && products.length > 0) {
        const allAdditionalImages = await Promise.all(
          products.map(product => getAdditionalImages(product.Name))
        );
        setAdditionalImages(allAdditionalImages.flat());
        console.log('Fetched additional images:', allAdditionalImages.flat());
      }
    };

    fetchAdditionalImages();
  }, [products]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'Price' || name === 'Stock' || name === 'quantity') {
      setNewProduct({ ...newProduct, [name]: parseFloat(value) });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    try {
      const productToAdd = { ...newProduct, RowKey: Date.now().toString() };
      await addProduct(productToAdd, selectedFile);
      setProducts([...products, productToAdd]);
      setNewProduct({
        PartitionKey: 'product',
        RowKey: '',
        Name: '',
        Price: 0,
        Stock: 0,
        Category: '',
        ImageUrl: '',
        quantity: 0,
        size: '',
      });
      setSelectedFile(null);
      setCurrentView('products');
      setError(null);
      console.log('Product added successfully:', productToAdd);
    } catch (err) {
      setError('Failed to add product');
    }
  };

  const handleAddAdditionalImage = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    try {
      const additionalImageToAdd = { 
        ...newAdditionalImage, 
        RowKey: Date.now().toString(),
        PartitionKey: newAdditionalImage.ProductId 
      };
      await addAdditionalImage(additionalImageToAdd, selectedFile);
      setAdditionalImages([...additionalImages, additionalImageToAdd]);
      setNewAdditionalImage({
        PartitionKey: '',
        RowKey: '',
        ImageUrl: '',
        ProductId: ''
      });
      setSelectedFile(null);
      setCurrentView('additionalImages');
      setError(null);
      console.log('Additional image added successfully:', additionalImageToAdd);
    } catch (err) {
      setError('Failed to add additional image');
    }
  };

  const handleAddShowroomImage = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
        setError('Please select a file to upload.');
        return;
    }

    try {
        const imageToAdd = { ...newShowroomImage, RowKey: Date.now().toString() };
        await addShowroomImage(imageToAdd, selectedFile);
        setShowroomImages([...showroomImages, imageToAdd]);
        setNewShowroomImage({
            PartitionKey: 'showroom',
            RowKey: '',
            Title: '',
            Description: '',
            ImageUrl: ''
        });
        setSelectedFile(null);
        setCurrentView('showroom');
        setError(null);
        console.log('Showroom image added successfully:', imageToAdd);
    } catch (err) {
        setError('Failed to add showroom image');
    }
  };

  const handleEditProduct = (product: Product) => {
    setNewProduct(product);
    setCurrentView('edit');
  };

  const handleUpdateProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Pass the selected file to the updateProduct function
      await updateProduct(newProduct, selectedFile ?? undefined);
      const updatedProducts = products.map(p => (p.RowKey === newProduct.RowKey ? newProduct : p));
      setProducts(updatedProducts);
      setNewProduct({
        PartitionKey: 'product',
        RowKey: '',
        Name: '',
        Price: 0,
        Stock: 0,
        Category: '',
        ImageUrl: '',
        quantity: 0, 
        size: '', 
      });
      setCurrentView('products');
      setError(null);
      console.log('Product updated successfully:', newProduct);
    } catch (err) {
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (partitionKey: string, rowKey: string) => {
    try {
      await deleteProduct(partitionKey, rowKey);
      const updatedProducts = products.filter(product => product.RowKey !== rowKey);
      setProducts(updatedProducts);
      console.log('Product deleted successfully:', partitionKey, rowKey);
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleDeleteShowroomImage = async (partitionKey: string, rowKey: string) => {
    try {
      await deleteShowroomImage(partitionKey, rowKey);
      const updatedImages = showroomImages.filter(image => image.PartitionKey !== partitionKey || image.RowKey !== rowKey);
      setShowroomImages(updatedImages);
      console.log('Showroom image deleted successfully:', partitionKey, rowKey);
    } catch (err) {
      setError('Failed to delete showroom image');
    }
  };

  const handleDeleteAdditionalImage = async (partitionKey: string, rowKey: string) => {
    try {
      await deleteAdditionalImage(partitionKey, rowKey);
      const updatedImages = additionalImages.filter(image => image.PartitionKey !== partitionKey || image.RowKey !== rowKey);
      setAdditionalImages(updatedImages);
      console.log('Additional image deleted successfully:', partitionKey, rowKey);
    } catch (err) {
      setError('Failed to delete additional image');
    }
  };

  const handleLogout = () => {
    setToken(null); // Clear the token from local storage
    navigate('/login'); // Navigate to the login page
  };

  const filteredProducts = products.filter(product =>
    product.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const matchAdditionalImages = (product: Product) => {
    const matchedImages = additionalImages.filter(img => img.ProductId === product.Name);
    console.log(`Matched images for ${product.Name}:`, matchedImages);
    return matchedImages;
  };

  return (
    <div className="admin-container">
      <h1>Admin Page</h1>

      <header className='admin-header'>
        <button onClick={() => setCurrentView('dashboard')}>Dashboard</button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <aside>
        <button onClick={() => setCurrentView('products')}>Products</button>
        <button onClick={() => {
          setNewProduct({
            PartitionKey: 'product',
            RowKey: '',
            Name: '',
            Price: 0,
            Stock: 0,
            Category: '',
            ImageUrl: '',
            quantity: 0,
            size: '',
          });
          setSelectedFile(null);
          setCurrentView('add');
        }}>Add New Product</button>
        <button onClick={() => setCurrentView('showroom')}>Showroom</button>
        <button onClick={() => {
          setNewShowroomImage({
            PartitionKey: 'showroom',
            RowKey: '',
            Title: '',
            Description: '',
            ImageUrl: ''
          });
          setSelectedFile(null);
          setCurrentView('addShowroomImage');
        }}>Add Showroom Image</button>
        <button onClick={() => setCurrentView('additionalImages')}>Add Gallery Images</button>
      </aside>
      <main>
        {currentView === 'dashboard' && (
          <div className="dashboard">
            <h2>Dashboard</h2>
            <p>Total Products: {products.length}</p>
            <p>Low Stock Alerts: {products.filter(product => product.Stock < 5).length}</p>
          </div>
        )}
        {currentView === 'products' && (
          <div className="product-list">
            <h2>Product List</h2>
            <input
              type="text"
              placeholder="Search products by name"
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.RowKey}>
                    <td>{product.Name}</td>
                    <td>{product.Price}</td>
                    <td>{product.Stock}</td>
                    <td>{product.Category}</td>
                    <td>
                      <button onClick={() => handleEditProduct(product)}>Edit</button>
                      <button onClick={() => handleDeleteProduct(product.PartitionKey, product.RowKey)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {(currentView === 'add' || currentView === 'edit') && (
          <form className="product-form" onSubmit={currentView === 'add' ? handleAddProduct : handleUpdateProduct}>
            <h2>{currentView === 'add' ? 'Add New Product' : 'Edit Product'}</h2>
            {error && <div className="error">{error}</div>}
            <input
              type="text"
              name="Name"
              value={newProduct.Name}
              onChange={handleInputChange}
              placeholder="Product Name"
              required
            />
            <input
              type="number"
              name="Price"
              value={newProduct.Price}
              onChange={handleInputChange}
              placeholder="Price"
              required
            />
            <input
              type="number"
              name="Stock"
              value={newProduct.Stock}
              onChange={handleInputChange}
              placeholder="Stock"
              required
            />
            <input
              type="text"
              name="Category"
              value={newProduct.Category}
              onChange={handleInputChange}
              placeholder="Category"
              required
            />
            <input
              type="number"
              name="quantity"
              value={newProduct.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              required
            />
            <input
              type="text"
              name="size"
              value={newProduct.size}
              onChange={handleInputChange}
              placeholder="Size"
            />
            <input type="file" onChange={handleFileChange} required={currentView === 'add'} />
            <button type="submit">{currentView === 'add' ? 'Add Product' : 'Update Product'}</button>
          </form>
        )}
        {currentView === 'showroom' && (
          <div className="showroom-list">
            <h2>Showroom Images</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {showroomImages.map((image) => (
                  <tr key={image.RowKey}>
                    <td>{image.Title}</td>
                    <td>{image.Description}</td>
                    <td>
                      <img src={image.ImageUrl} alt={image.Title} />
                    </td>
                    <td>
                      <button onClick={() => handleDeleteShowroomImage(image.PartitionKey, image.RowKey)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {currentView === 'addShowroomImage' && (
          <form className="showroom-form" onSubmit={handleAddShowroomImage}>
            <h2>Add Showroom Image</h2>
            {error && <div className="error">{error}</div>}
            <input
              type="text"
              name="Title"
              value={newShowroomImage.Title}
              onChange={(e) => setNewShowroomImage({ ...newShowroomImage, Title: e.target.value })}
              placeholder="Image Title"
              required
            />
            <input
              type="text"
              name="Description"
              value={newShowroomImage.Description}
              onChange={(e) => setNewShowroomImage({ ...newShowroomImage, Description: e.target.value })}
              placeholder="Image Description"
              required
            />
            <input type="file" onChange={handleFileChange} required />
            <button type="submit">Add Showroom Image</button>
          </form>
        )}
        {currentView === 'additionalImages' && (
          <form className="additional-image-form" onSubmit={handleAddAdditionalImage}>
            <h2>Add Gallery Image</h2>
            {error && <div className="error">{error}</div>}
            <input
              type="text"
              name="ProductName"
              value={newAdditionalImage.ProductId}
              onChange={(e) => setNewAdditionalImage({ ...newAdditionalImage, ProductId: e.target.value })}
              placeholder="Product Name"
              required
            />
            <input type="file" onChange={handleFileChange} required />
            <button type="submit">Add Gallery Image</button>
          </form>
        )}
        {currentView === 'products' && (
            <div className="product-gallery">
            <h2>Product Gallery</h2>
            {products.map(product => (
              <div key={product.RowKey} className="product-gallery-item">
                <h3>{product.Name}</h3>
                <img src={product.ImageUrl} alt={product.Name} />
                <div className="additional-images">
                  <h4>Gallery Images</h4>
                  {matchAdditionalImages(product).map(img => (
                    <div key={img.RowKey} className="additional-image-item">
                      <h5>Gallery Image for {product.Name}</h5>
                      <img src={img.ImageUrl} alt={`${product.Name} additional`} />
                      <button onClick={() => handleDeleteAdditionalImage(img.PartitionKey, img.RowKey)}>Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer>
        <p>&copy; 2024 Jo`s Art. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminPage;
