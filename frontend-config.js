// ============================================
// FARMER MARKET - FRONTEND API CONFIGURATION
// ============================================

const API_BASE_URL = 'http://localhost:5000/api';

// Store auth token in sessionStorage (cleared on browser close)
const getAuthToken = () => sessionStorage.getItem('authToken');
const setAuthToken = (token) => sessionStorage.setItem('authToken', token);
const clearAuthToken = () => sessionStorage.removeItem('authToken');

// Universal API caller with error handling
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    // Add auth token if available
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers: headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
            credentials: 'omit' // CORS requests
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw {
                status: response.status,
                message: data.message || 'API Error',
                error: data
            };
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============================================
// AUTH ENDPOINTS
// ============================================

async function loginUser(email, password) {
    try {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: { email, password }
        });
        
        if (response.success && response.data) {
            // Extract token and user from response
            const token = response.data.token || null;
            const user = response.data.user || response.data;
            
            if (token) {
                setAuthToken(token);
            }
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
        console.error('Login error:', error);
        return { 
            success: false, 
            message: error.message || 'Network error. Please check your connection and ensure the backend server is running on http://localhost:5000'
        };
    }
}

async function registerUser(name, email, password, role) {
    try {
        const response = await apiCall('/auth/register', {
            method: 'POST',
            body: { name, email, password, role }
        });
        
        if (response.success) {
            return { success: true, message: 'Registration successful' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function getCurrentUser() {
    try {
        const response = await apiCall('/auth/current-user');
        return response.data || null;
    } catch (error) {
        clearAuthToken();
        return null;
    }
}

// ============================================
// PRODUCT ENDPOINTS
// ============================================

async function getProducts(filters = {}) {
    try {
        let endpoint = '/products';
        const params = new URLSearchParams();
        
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.sort) params.append('sort', filters.sort);
        
        if (params.toString()) {
            endpoint += '?' + params.toString();
        }
        
        const response = await apiCall(endpoint);
        return response.data || [];
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}

async function getProductById(id) {
    try {
        const response = await apiCall(`/products/${id}`);
        return response.data || null;
    } catch (error) {
        console.error('Failed to fetch product:', error);
        return null;
    }
}

async function createProduct(productData) {
    try {
        const response = await apiCall('/products', {
            method: 'POST',
            body: productData
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// ============================================
// ORDER ENDPOINTS
// ============================================

async function getOrders(filters = {}) {
    try {
        let endpoint = '/orders';
        const params = new URLSearchParams();
        
        if (filters.status) params.append('status', filters.status);
        if (filters.role) params.append('role', filters.role);
        
        if (params.toString()) {
            endpoint += '?' + params.toString();
        }
        
        const response = await apiCall(endpoint);
        return response.data || [];
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return [];
    }
}

async function getOrderById(id) {
    try {
        const response = await apiCall(`/orders/${id}`);
        return response.data || null;
    } catch (error) {
        console.error('Failed to fetch order:', error);
        return null;
    }
}

async function createOrder(orderData) {
    try {
        const response = await apiCall('/orders', {
            method: 'POST',
            body: orderData
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        const response = await apiCall(`/orders/${orderId}`, {
            method: 'PUT',
            body: { status }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// ============================================
// REVIEW ENDPOINTS
// ============================================

async function getProductReviews(productId) {
    try {
        const response = await apiCall(`/reviews/product/${productId}`);
        return response.data || [];
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
        return [];
    }
}

async function createReview(productId, rating, comment) {
    try {
        const response = await apiCall('/reviews', {
            method: 'POST',
            body: { productId, rating, comment }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// ============================================
// WISHLIST ENDPOINTS
// ============================================

async function getWishlist() {
    try {
        const response = await apiCall('/wishlist');
        return response.data || [];
    } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        return [];
    }
}

async function addToWishlist(productId) {
    try {
        const response = await apiCall('/wishlist', {
            method: 'POST',
            body: { productId }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function removeFromWishlist(productId) {
    try {
        await apiCall(`/wishlist/${productId}`, {
            method: 'DELETE'
        });
        return true;
    } catch (error) {
        throw error;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

function isLoggedIn() {
    return !!getAuthToken();
}

function logout() {
    clearAuthToken();
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function redirectIfNotLoggedIn() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}
