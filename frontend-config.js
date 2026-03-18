// ============================================
// FARMER MARKET - FRONTEND API CONFIGURATION
// ============================================

// Use relative API paths - server serves both frontend and backend
const API_BASE_URL = '/api';

console.log('✅ Frontend API Config Loaded');
console.log('📍 API Base URL:', API_BASE_URL);

// Store auth token in sessionStorage (cleared on browser close)
const getAuthToken = () => sessionStorage.getItem('authToken');
const setAuthToken = (token) => {
    sessionStorage.setItem('authToken', token);
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
        console.log(`📌 Full URL: http://localhost:5000${endpoint}`);
        
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers: headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
            credentials: 'include'
        });
        
        console.log(`📍 HTTP Status: ${response.status}`);
        
        // Parse response
        let data;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
            console.log(`📦 Response Data:`, data);
        } else {
            const text = await response.text();
            data = { success: false, message: `Invalid response type: ${contentType}`, raw: text };
        }
        
        // Check if HTTP response was successful
        if (!response.ok) {
            console.error(`❌ HTTP Error ${response.status}:`, data?.message);
            const errorMessage = data?.message || `HTTP ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
        }
        
        console.log(`✅ API Success: ${data?.success}`);
        return data;
        
    } catch (error) {
        console.error(`❌ API Error (${url}):`, error);
        console.error(`❌ Error Message:`, error.message);
        console.error(`❌ Error Stack:`, error.stack);
        throw error;
    }
}

// ============================================
// AUTH ENDPOINTS
// ============================================

async function loginUser(email, password) {
    try {
        if (!email || !password) {
            return { success: false, message: 'Email and password are required' };
        }
        
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: { email, password }
        });
        
        if (!response?.success) {
            return { success: false, message: response?.message || 'Login failed' };
        }
        
        const userData = response.data;
        if (!userData || !userData.id || !userData.email || !userData.role) {
            return { success: false, message: 'Invalid server response' };
        }
        
        // Store token if present
        if (userData.token) {
            setAuthToken(userData.token);
        }
        
        // Store user data
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        
        return { 
            success: true,
            message: 'Login successful',
            user: {
                id: userData.id,
                name: userData.name || 'User',
                email: userData.email,
                role: userData.role
            }
        };
        
    } catch (error) {
        console.error('Login error:', error.message);
        return { success: false, message: error.message || 'Login failed' };
    }
    
    // Absolute fallback - should never reach here but ensures we always return something
    console.error('⚠️ CRITICAL: loginUser reached end without returning!');
    return { success: false, message: 'Unexpected error in login function' };
}

async function registerUser(name, email, password, role) {
    console.log('📝 registerUser called with:', {name, email, role});
    
    try {
        if (!name || !email || !password || !role) {
            console.warn('⚠️ Missing required fields');
            return { success: false, message: 'All fields are required' };
        }
        
        console.log('📡 Calling apiCall for registration...');
        const response = await apiCall('/auth/register', {
            method: 'POST',
            body: { name, email, password, role }
        });
        
        console.log('📦 registerUser received response:', response);
        
        if (!response?.success) {
            console.error('❌ API returned success: false');
            return { success: false, message: response?.message || 'Registration failed' };
        }
        
        const userData = response.data;
        console.log('👤 User data:', userData);
        
        if (!userData || !userData.id || !userData.email || !userData.role) {
            console.error('❌ Invalid user data in response:', userData);
            return { success: false, message: 'Invalid server response - missing user data' };
        }
        
        // Store token if present
        if (userData.token) {
            console.log('🔐 Storing auth token');
            setAuthToken(userData.token);
        }
        
        // Store user data
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('✅ User registered successfully');
        
        return { 
            success: true,
            message: 'Registration successful',
            user: {
                id: userData.id,
                name: userData.name || name,
                email: userData.email,
                role: userData.role
            }
        };
        
    } catch (error) {
        console.error('❌ registerUser caught error:');
        console.error('   Type:', error.name);
        console.error('   Message:', error.message);
        console.error('   Full error:', error);
        
        const errorMessage = error?.message || 'Registration failed';
        return { success: false, message: `Error: ${errorMessage}` };
    }
    
    // Absolute fallback - should never reach here but ensures we always return something
    console.error('⚠️ CRITICAL: registerUser reached end without returning!');
    return { success: false, message: 'Unexpected error in registration function' };
}

async function getCurrentUser() {
    try {
        console.log('📍 Fetching current user...');
        const response = await apiCall('/auth/me');
        console.log('✅ Current user response:', response);
        
        if (response && response.success && response.data) {
            console.log('✅ Current user retrieved:', response.data);
            return response.data;
        } else {
            console.warn('⚠️ Invalid getCurrentUser response');
            clearAuthToken();
            return null;
        }
    } catch (error) {
        console.error('❌ getCurrentUser error:', error?.message);
        clearAuthToken();
        return null;
    }
}

async function updateUserProfile(updates) {
    try {
        console.log('✏️ Updating user profile:', updates);
        const response = await apiCall('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
        console.log('✅ Update profile response:', response);
        
        if (response && response.success && response.data) {
            // Update sessionStorage with new user data
            sessionStorage.setItem('currentUser', JSON.stringify(response.data));
            console.log('✅ Profile updated successfully:', response.data);
            return response.data;
        } else {
            console.warn('⚠️ Invalid updateUserProfile response');
            return null;
        }
    } catch (error) {
        console.error('❌ updateUserProfile error:', error?.message);
        throw error;
    }
}

// ============================================
// PRODUCT ENDPOINTS
// ============================================

async function getProducts(filters = {}) {
    try {
        console.log('📦 Fetching products with filters:', filters);
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
        console.log('✅ Products response:', response);
        
        if (response && response.success && Array.isArray(response.data)) {
            console.log('✅ Returning', response.data.length, 'products');
            return response.data;
        } else if (response && Array.isArray(response.data)) {
            return response.data;
        } else {
            console.warn('⚠️ Products response invalid:', response);
            return [];
        }
    } catch (error) {
        console.error('❌ Failed to fetch products:', error?.message);
        return [];
    }
}

async function getProductById(id) {
    try {
        console.log('🔍 Fetching product:', id);
        const response = await apiCall(`/products/${id}`);
        console.log('✅ Product response:', response);
        
        if (response && response.success && response.data) {
            console.log('✅ Product retrieved');
            return response.data;
        } else if (response && response.data) {
            return response.data;
        } else {
            console.warn('⚠️ Product response invalid:', response);
            return null;
        }
    } catch (error) {
        console.error('❌ Failed to fetch product:', error?.message);
        return null;
    }
}

async function createProduct(productData) {
    try {
        console.log('➕ Creating product:', productData);
        const response = await apiCall('/products', {
            method: 'POST',
            body: productData
        });
        console.log('✅ Create product response:', response);
        
        if (response && response.data) {
            console.log('✅ Product created successfully');
            return response.data;
        } else {
            console.warn('⚠️ Create response invalid:', response);
            throw new Error(response?.message || 'Failed to create product');
        }
    } catch (error) {
        console.error('❌ Failed to create product:', error?.message);
        throw error;
    }
}

async function updateProduct(productId, productData) {
    try {
        console.log('✏️ Updating product:', productId, productData);
        const response = await apiCall(`/products/${productId}`, {
            method: 'PUT',
            body: productData
        });
        console.log('✅ Update product response:', response);
        
        if (response && response.data) {
            console.log('✅ Product updated successfully');
            return response.data;
        } else {
            console.warn('⚠️ Update response invalid:', response);
            throw new Error(response?.message || 'Failed to update product');
        }
    } catch (error) {
        console.error('❌ Failed to update product:', error?.message);
        throw error;
    }
}

async function deleteProduct(productId) {
    try {
        console.log('🗑️ Deleting product:', productId);
        const response = await apiCall(`/products/${productId}`, {
            method: 'DELETE'
        });
        console.log('✅ Delete product response:', response);
        
        if (response && response.success) {
            console.log('✅ Product deleted successfully');
            return true;
        } else {
            console.warn('⚠️ Delete response invalid:', response);
            throw new Error(response?.message || 'Failed to delete product');
        }
    } catch (error) {
        console.error('❌ Failed to delete product:', error?.message);
        throw error;
    }
}

// ============================================
// ORDER ENDPOINTS
// ============================================

async function getOrders(filters = {}) {
    try {
        console.log('📋 Fetching orders with filters:', filters);
        let endpoint = '/orders/my-orders';
        const params = new URLSearchParams();
        
        if (filters.status) params.append('status', filters.status);
        if (filters.role) params.append('role', filters.role);
        
        if (params.toString()) {
            endpoint += '?' + params.toString();
        }
        
        const response = await apiCall(endpoint);
        console.log('✅ Orders response:', response);
        
        if (response && response.success && Array.isArray(response.data)) {
            console.log('✅ Returning', response.data.length, 'orders');
            return response.data;
        } else if (response && Array.isArray(response.data)) {
            return response.data;
        } else {
            console.warn('⚠️ Orders response invalid:', response);
            return [];
        }
    } catch (error) {
        console.error('❌ Failed to fetch orders:', error?.message);
        return [];
    }
}

async function getOrderById(id) {
    try {
        console.log('🔍 Fetching order:', id);
        const response = await apiCall(`/orders/${id}`);
        console.log('✅ Order response:', response);
        
        if (response && response.data) {
            return response.data;
        } else {
            console.warn('⚠️ Order response invalid:', response);
            return null;
        }
    } catch (error) {
        console.error('❌ Failed to fetch order:', error?.message);
        return null;
    }
}

async function createOrder(orderData) {
    try {
        console.log('➕ Creating order:', orderData);
        const response = await apiCall('/orders', {
            method: 'POST',
            body: orderData
        });
        console.log('✅ Create order response:', response);
        
        if (response && response.data) {
            return response.data;
        } else {
            throw new Error(response?.message || 'Failed to create order');
        }
    } catch (error) {
        console.error('❌ Failed to create order:', error?.message);
        throw error;
    }
}

async function getFarmerOrders() {
    try {
        console.log('📦 Fetching farmer orders...');
        const response = await apiCall('/orders/farmer-orders');
        console.log('✅ Farmer orders response:', response);
        
        if (response && Array.isArray(response.data)) {
            return response.data;
        } else if (response && Array.isArray(response)) {
            return response;
        } else if (response?.success && response.data) {
            return Array.isArray(response.data) ? response.data : [];
        } else {
            return [];
        }
    } catch (error) {
        console.error('❌ Failed to fetch farmer orders:', error?.message);
        return [];
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        console.log('♻️ Updating order status:', orderId, status);
        const response = await apiCall(`/orders/${orderId}/status`, {
            method: 'PUT',
            body: { status }
        });
        console.log('✅ Update order response:', response);
        
        if (response && response.data) {
            return response.data;
        } else {
            throw new Error(response?.message || 'Failed to update order');
        }
    } catch (error) {
        console.error('❌ Failed to update order status:', error?.message);
        throw error;
    }
}

// ============================================
// REVIEW ENDPOINTS
// ============================================

async function getProductReviews(productId) {
    try {
        console.log('⭐ Fetching reviews for product:', productId);
        const response = await apiCall(`/reviews/product/${productId}`);
        console.log('✅ Reviews response:', response);
        
        if (response && Array.isArray(response.data)) {
            return response.data;
        } else if (response && Array.isArray(response)) {
            return response;
        } else {
            return [];
        }
    } catch (error) {
        console.error('❌ Failed to fetch reviews:', error?.message);
        return [];
    }
}

async function createReview(productId, rating, comment) {
    try {
        console.log('✍️ Creating review for product:', productId, 'Rating:', rating);
        const response = await apiCall('/reviews', {
            method: 'POST',
            body: { productId, rating, comment }
        });
        console.log('✅ Create review response:', response);
        
        if (response && response.data) {
            return response.data;
        } else {
            throw new Error(response?.message || 'Failed to create review');
        }
    } catch (error) {
        console.error('❌ Failed to create review:', error?.message);
        throw error;
    }
}

// ============================================
// WISHLIST ENDPOINTS
// ============================================

async function getWishlist() {
    try {
        console.log('❤️ Fetching wishlist');
        const response = await apiCall('/wishlist');
        console.log('✅ Wishlist response:', response);
        
        if (response && Array.isArray(response.data)) {
            return response.data;
        } else if (response && Array.isArray(response)) {
            return response;
        } else {
            return [];
        }
    } catch (error) {
        console.error('❌ Failed to fetch wishlist:', error?.message);
        return [];
    }
}

async function addToWishlist(productId) {
    try {
        console.log('❤️ Adding to wishlist:', productId);
        const response = await apiCall('/wishlist', {
            method: 'POST',
            body: { productId }
        });
        console.log('✅ Add to wishlist response:', response);
        
        if (response && response.data) {
            return response.data;
        } else {
            return { success: true };
        }
    } catch (error) {
        console.error('❌ Failed to add to wishlist:', error?.message);
        throw error;
    }
}

async function removeFromWishlist(productId) {
    try {
        console.log('💔 Removing from wishlist:', productId);
        const response = await apiCall(`/wishlist/${productId}`, {
            method: 'DELETE'
        });
        console.log('✅ Remove from wishlist response:', response);
        return true;
    } catch (error) {
        console.error('❌ Failed to remove from wishlist:', error?.message);
        throw error;
    }
}

// ============================================
// ADMIN ENDPOINTS
// ============================================

async function getAdminUsers() {
    try {
        console.log('👥 Fetching all users...');
        const response = await apiCall('/admin/users');
        console.log('✅ Users response:', response);
        
        if (response && response.data && Array.isArray(response.data)) {
            return response.data;
        } else if (response && Array.isArray(response.data)) {
            return response.data;
        } else {
            console.warn('⚠️ Users response invalid:', response);
            return [];
        }
    } catch (error) {
        console.error('❌ Failed to fetch users:', error?.message);
        return [];
    }
}

async function deleteAdminUser(userId) {
    try {
        console.log('🗑️ Deleting user:', userId);
        const response = await apiCall(`/admin/users/${userId}`, {
            method: 'DELETE'
        });
        console.log('✅ Delete user response:', response);
        
        if (response && response.success) {
            return true;
        } else {
            throw new Error(response?.message || 'Failed to delete user');
        }
    } catch (error) {
        console.error('❌ Failed to delete user:', error?.message);
        throw error;
    }
}

async function getAdminProducts() {
    try {
        console.log('📦 Fetching admin products...');
        const response = await apiCall('/admin/products');
        console.log('✅ Admin products response:', response);
        
        if (response && response.data && Array.isArray(response.data)) {
            return response.data;
        } else {
            return [];
        }
    } catch (error) {
        console.error('❌ Failed to fetch admin products:', error?.message);
        return [];
    }
}

async function deleteAdminProduct(productId) {
    try {
        console.log('🗑️ Deleting product:', productId);
        const response = await apiCall(`/admin/products/${productId}`, {
            method: 'DELETE'
        });
        console.log('✅ Delete product response:', response);
        
        if (response && response.success) {
            return true;
        } else {
            throw new Error(response?.message || 'Failed to delete product');
        }
    } catch (error) {
        console.error('❌ Failed to delete product:', error?.message);
        throw error;
    }
}

async function getAdminOrders() {
    try {
        console.log('📋 Fetching admin orders...');
        const response = await apiCall('/admin/orders');
        console.log('✅ Admin orders response:', response);
        
        if (response && response.data && Array.isArray(response.data)) {
            return response.data;
        } else {
            return [];
        }
    } catch (error) {
        console.error('❌ Failed to fetch admin orders:', error?.message);
        return [];
    }
}

async function getAdminAnalytics() {
    try {
        console.log('📊 Fetching analytics...');
        const response = await apiCall('/admin/analytics');
        console.log('✅ Analytics response:', response);
        
        if (response && response.data) {
            return response.data;
        } else {
            return {};
        }
    } catch (error) {
        console.error('❌ Failed to fetch analytics:', error?.message);
        return {};
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
