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
        console.log(`📄 Request Body:`, options.body ? JSON.stringify(options.body) : 'None');
        
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers: headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
            credentials: 'same-origin'
        });
        
        console.log(`📍 Response Status: ${response.status} ${response.statusText}`);
        
        // Always try to parse as JSON
        let data;
        const contentType = response.headers.get('content-type');
        console.log(`📋 Content-Type: ${contentType}`);
        
        if (contentType && contentType.includes('application/json')) {
            try {
                data = await response.json();
                console.log('✅ Response JSON parsed:', JSON.stringify(data, null, 2));
            } catch (parseError) {
                console.error('❌ JSON Parse Error:', parseError);
                console.log('📝 Raw response text:', await response.text());
                throw new Error(`Failed to parse response as JSON: ${parseError.message}`);
            }
        } else {
            const text = await response.text();
            console.log('⚠️ Response is not JSON, received:', text);
            data = { success: false, message: `Invalid response type. Expected JSON, got ${contentType}`, raw: text };
        }
        
        // Check if HTTP response was successful
        if (!response.ok) {
            console.error('❌ HTTP Error:', response.status, data);
            const errorMessage = data?.message || `HTTP ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
        }
        
        console.log('✅ API Success');
        return data;
        
    } catch (error) {
        console.error('❌ API Call Exception:', error);
        throw error;
    }
}

// ============================================
// AUTH ENDPOINTS
// ============================================

async function loginUser(email, password) {
    console.log('========================================');
    console.log('🔐 LOGIN PROCESS STARTED');
    console.log('========================================');
    console.log('📧 Email:', email);
    
    try {
        console.log('\n1️⃣ Calling API endpoint: POST /auth/login');
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: { email, password }
        });
        
        console.log('\n2️⃣ Response received from apiCall');
        console.log('📦 Response object:', response);
        console.log('📊 Response.success:', response?.success);
        console.log('📊 Response.data:', response?.data);
        
        // Check if login was successful
        if (response && response.success === true && response.data) {
            console.log('\n3️⃣ Login successful, extracting user data');
            const userData = response.data;
            
            console.log('👤 User ID:', userData.id);
            console.log('👤 User Name:', userData.name);
            console.log('👤 User Email:', userData.email);
            console.log('👤 User Role:', userData.role);
            console.log('🔑 Has Token:', !!userData.token);
            
            // Store token
            if (userData.token) {
                console.log('\n4️⃣ Storing auth token');
                setAuthToken(userData.token);
                console.log('✅ Token stored successfully');
            }
            
            // Store user data in sessionStorage
            console.log('\n5️⃣ Storing user data in sessionStorage');
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
            console.log('✅ User data stored successfully');
            
            console.log('\n6️⃣ Returning success response');
            const result = { 
                success: true, 
                user: {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role
                }
            };
            console.log('✅ SUCCESS - Login returned:', result);
            console.log('========================================\n');
            return result;
        }
        
        // Response was not successful
        console.error('\n❌ Response indicates failure');
        console.error('Response:', response);
        const errorMsg = response?.message || 'Login failed - invalid response';
        throw new Error(errorMsg);
        
    } catch (error) {
        console.error('\n❌ LOGIN ERROR - Exception caught');
        console.error('❌ Error message:', error?.message);
        console.error('❌ Error object:', error);
        console.error('========================================\n');
        
        // Return formatted error for UI
        const errorMessage = error?.message || 'An error occurred during login. Please check the console for details.';
        return { 
            success: false, 
            message: errorMessage
        };
    }
}

async function registerUser(name, email, password, role) {
    console.log('========================================');
    console.log('📝 REGISTRATION PROCESS STARTED');
    console.log('========================================');
    console.log('👤 Name:', name);
    console.log('📧 Email:', email);
    console.log('👥 Role:', role);
    
    try {
        console.log('\n1️⃣ Calling API endpoint: POST /auth/register');
        const response = await apiCall('/auth/register', {
            method: 'POST',
            body: { name, email, password, role }
        });
        
        console.log('\n2️⃣ Response received from apiCall');
        console.log('📦 Response object:', response);
        console.log('📊 Response.success:', response?.success);
        console.log('📊 Response.data:', response?.data);
        
        // Check if registration was successful
        if (response && response.success === true && response.data) {
            console.log('\n3️⃣ Registration successful, extracting user data');
            const userData = response.data;
            
            console.log('👤 User ID:', userData.id);
            console.log('👤 User Name:', userData.name);
            console.log('👤 User Email:', userData.email);
            console.log('👤 User Role:', userData.role);
            console.log('🔑 Has Token:', !!userData.token);
            
            // Store token
            if (userData.token) {
                console.log('\n4️⃣ Storing auth token');
                setAuthToken(userData.token);
                console.log('✅ Token stored successfully');
            }
            
            // Store user data in sessionStorage
            console.log('\n5️⃣ Storing user data in sessionStorage');
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
            console.log('✅ User data stored successfully');
            
            console.log('\n6️⃣ Returning success response');
            const result = { 
                success: true, 
                message: 'Registration successful',
                user: {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role
                }
            };
            console.log('✅ SUCCESS - Registration returned:', result);
            console.log('========================================\n');
            return result;
        }
        
        // Response was not successful
        console.error('\n❌ Response indicates failure');
        console.error('Response:', response);
        const errorMsg = response?.message || 'Registration failed - invalid response';
        throw new Error(errorMsg);
        
    } catch (error) {
        console.error('\n❌ REGISTRATION ERROR - Exception caught');
        console.error('❌ Error message:', error?.message);
        console.error('❌ Error object:', error);
        console.error('========================================\n');
        
        // Return formatted error for UI
        const errorMessage = error?.message || 'An error occurred during registration. Please check the console for details.';
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
