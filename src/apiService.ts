import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

// Token Retrieval Function
const getToken = (): string | null => {
    const token = localStorage.getItem('token');
    return token ? token.replace(/"/g, '') : null;
};

export interface Product {
    PartitionKey: string;
    RowKey: string;
    Name: string;
    Price: number;
    Stock: number;
    Category: string;
    ImageUrl: string;
    quantity: number;
    size?: string;
}

export interface AdditionalImage {
    PartitionKey: string; // Typically the product ID
    RowKey: string; // Unique ID for the image
    ImageUrl: string;
    ProductId: string;
}

export interface User {
    PartitionKey: string;
    RowKey: string;
    Name: string;
    Email: string;
    PasswordHash: string;
}

export interface Review {
    user: string;
    comment: string;
    rating: number;
    PartitionKey?: string;
    RowKey?: string;
    Timestamp?: string;
}

export interface FormData {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
}

export interface ShowroomImage {
    PartitionKey: string;
    RowKey: string;
    Title: string;
    Description: string;
    ImageUrl: string;
}


export const getVisitCount = async (): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/VisitCounter`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch visit count: ${errorText}`);
    }

    const data = await response.json();
    return data.count;
};


export const addProduct = async (product: Product, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('product', JSON.stringify(product));
    formData.append('file', file);

    const token = getToken();

    if (!token) {
        throw new Error('Token is not available');
    }

    console.log('Token:', token); 



    const response = await fetch(`${API_BASE_URL}/AddProduct`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add product: ${errorText}`);
    }
};

export const updateProduct = async (product: Product, file?: File): Promise<void> => {
    const formData = new FormData();
    formData.append('product', JSON.stringify(product));

    if (file) {
        formData.append('file', file);
    }

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/UpdateProduct`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to update product:', errorText);
        throw new Error(`Failed to update product: ${errorText}`);
    }

    console.log('Product updated successfully');
};

export const getProducts = async (): Promise<Product[]> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/GetProducts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch products: ${errorText}`);
    }

    const products: Product[] = await response.json();
    return products;
};

export const deleteProduct = async (partitionKey: string, rowKey: string): Promise<void> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/DeleteProduct/${partitionKey}/${rowKey}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete product: ${errorText}`);
    }
};

export const addUser = async (user: User): Promise<void> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/AddUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add user: ${errorText}`);
    }
};

export const getUsers = async (): Promise<User[]> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/GetUsers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch users: ${errorText}`);
    }

    const users: User[] = await response.json();
    return users;
};

export const getUser = async (partitionKey: string, rowKey: string): Promise<User> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/GetUser?partitionKey=${partitionKey}&rowKey=${rowKey}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch user: ${errorText}`);
    }

    const user: User = await response.json();
    return user;
};

// Function to fetch additional images for a product
export const getAdditionalImages = async (productId: string): Promise<AdditionalImage[]> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/GetAdditionalImages?productId=${productId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch additional images: ${errorText}`);
    }

    const additionalImages: AdditionalImage[] = await response.json();
    return additionalImages;
};

// Function to add an additional image to a product
export const addAdditionalImage = async (additionalImage: AdditionalImage, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('additionalImage', JSON.stringify(additionalImage));
    formData.append('file', file);

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/AddAdditionalImage`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add additional image: ${errorText}`);
    }
};

// Function to delete an additional image
export const deleteAdditionalImage = async (partitionKey: string, rowKey: string): Promise<void> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/DeleteAdditionalImage/${partitionKey}/${rowKey}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete additional image: ${errorText}`);
    }
};

// Function to fetch reviews for a product
export const getReviews = async (productId: string): Promise<Review[]> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch reviews: ${errorText}`);
    }

    const reviews: Review[] = await response.json();
    return reviews;
};

// Function to submit a review for a product
export const submitReview = async (productId: string, user: string, rating: number, comment: string): Promise<void> => {
    const review = {
        user,
        rating,
        comment,
        productId
    };

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/SubmitReview`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(review),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to submit review:', errorText);
        throw new Error(`Failed to submit review: ${errorText}`);
    }
};

// Utility function to check authentication
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token found in local storage');
        return false;
    }

    try {
        const decodedToken = jwtDecode<{ exp: number }>(token);
        console.log('Decoded token:', decodedToken);

        const { exp } = decodedToken;
        if (exp && Date.now() >= exp * 1000) {
            console.log('Token has expired');
            localStorage.removeItem('token'); // Remove expired token
            return false;
        }

        console.log('Token is valid');
        return true;
    } catch (e) {
        console.error('Invalid token', e);
        return false;
    }
};

// Showroom Image Management
// API service functions for showroom images

// Add showroom image
export const addShowroomImage = async (showroomImage: ShowroomImage, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('showroomImage', JSON.stringify(showroomImage));
    formData.append('file', file);

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/AddShowroomImage`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add showroom image: ${errorText}`);
    }
};

// Get showroom images
export const getShowroomImages = async (): Promise<ShowroomImage[]> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/GetShowroomImages`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch showroom images: ${errorText}`);
    }

    const showroomImages: ShowroomImage[] = await response.json();
    return showroomImages;
};

export const deleteShowroomImage = async (partitionKey: string, rowKey: string): Promise<void> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/DeleteShowroomImage/${partitionKey}/${rowKey}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete showroom image: ${errorText}`);
    }
};