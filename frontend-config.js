// ============================================
// FARMER MARKET - FRONTEND API CONFIGURATION
// ============================================

const API_BASE_URL = 'http://localhost:5000/api';

console.log('🔧 Frontend Config Loaded - API Base URL:', API_BASE_URL);

// Store auth token in sessionStorage (cleared on browser close)
const getAuthToken = () => sessionStorage.getItem('authToken');
const setAuthToken = (token) => {
    sessionStorage.setItem('authToken', token);
    console.log('✅ Auth token saved');
};
const clearAuthToken = () => sessionStorage.removeItem('authToken');

// Universal API caller with proper error handling
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
        console.log(`📡 API Call: ${options.method || 'GET'} ${url}`);
        
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers: headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
            credentials: 'same-origin'
        });
        
        console.log(`📍 Response Status: ${response.status}`);
        
        // Try to parse JSON response
        let data;
        try {
            data = await response.json();
        } catch (e) {
            console.error('❌ Failed to parse JSON response:', e);
            throw {
                status: response.status,
                message: `Server error: ${response.statusText}`,
                error: e
            };
        }
        
        // If response not ok, throw error with the data
        if (!response.ok) {
            console.error('❌ API Error:', data);
            throw {
                status: response.status,
                message: data.message || `Error: ${response.statusText}`,
                error: data
            };
        }
        
        console.log('✅ API Success:', data);
        return data;
        
    } catch (error) {
        console.error('❌ API Call Failed:', error);
        throw error;
    }
}

// ============================================
// AUTH ENDPOINTS
// ============================================

async function loginUser(email, password) {
    console.log('🔐 Login Attempt:', email);
    console.log(`🔐 Calling API endpoint: /auth/login`);
    
    try {
        console.log('📡 About to call apiCall with endpoint /auth/login');
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: { email, password }
        });
        
        console.log('📊 Full response object:', JSON.stringify(response, null, 2));
        
        // Extract data properly
        if (response && response.success === true) {
            console.log('✅ Login successful');
            const userData = response.data;
            
            console.log('📦 User data from response:', userData);
            
            // Store token
            if (userData && userData.token) {
                setAuthToken(userData.token);
                console.log('🔑 Token stored:', userData.token.substring(0, 20) + '...');
            }
            
            // Store user data
            if (userData) {
                sessionStorage.setItem('currentUser', JSON.stringify(userData));
                console.log('💾 User stored in sessionStorage');
            }
            
            return { 
                success: true, 
                user: {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role
                }
            };
        }
        
        // If we get here, something went wrong
        console.error('❌ Response not successful. Response:', response);
        const errorMsg = response?.message || 'Login failed';
        throw new Error(errorMsg);
        
    } catch (error) {
        console.error('❌ Login Error caught:', error);
        console.error('❌ Error properties:', {
            message: error?.message,
            status: error?.status,
            fullError: error
        });
        const errorMessage = error?.message || 'Network error. Please ensure backend server is running on http://localhost:5000';
        return { 
            success: false, 
            message: errorMessage
        };
    }
}

async function registerUser(name, email, password, role) {
    try {
        console.log('📝 Registration Start - Email:', email, 'Role:', role);
        
        const response = await apiCall('/auth/register', {
            method: 'POST',
            body: { name, email, password, role }
        });
        
        console.log('✅ Registration Response:', response);
        
        if (response && response.success === true) {
            console.log('✅ Registration successful');
            const userData = response.data;
            
            console.log('📦 User data from response:', userData);
            
            // Store token if provided
            if (userData && userData.token) {
                setAuthToken(userData.token);
                console.log('🔑 Token stored:', userData.token.substring(0, 20) + '...');
            }
            
            // Store user data
            if (userData) {
                sessionStorage.setItem('currentUser', JSON.stringify(userData));
                console.log('💾 User stored in sessionStorage');
            }
            
            return { 
                success: true, 
                message: 'Registration successful',
                user: {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role
                }
            };
        }
        
        // If we get here, response wasn't successful
        console.error('❌ Response not successful. Response:', response);
        throw new Error(response?.message || 'Registration failed');
        
    } catch (error) {
        console.error('❌ Registration Error:', error);
        console.error('❌ Error properties:', {
            message: error?.message,
            status: error?.status,
            fullError: error
        });
        const errorMessage = error?.message || 'Network error. Please ensure backend server is running on http://localhost:5000';
        return { 
            success: false, 
            message: errorMessage
        };
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
