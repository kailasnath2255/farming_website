/* ============================================
   APPLICATION INITIALIZATION
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupDummyUsers();
    loadTheme();
    setupEventListeners();
});

/* ============================================
   INITIALIZATION FUNCTIONS
   ============================================ */

function initializeApp() {
    // Initialize localStorage if empty
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([]));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'light');
    }
}

function setupDummyUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if dummy users already exist
    if (users.length > 0) {
        return;
    }

    const dummyUsers = [
        {
            id: 'user_admin_001',
            name: 'Admin User',
            email: 'admin@farm.com',
            password: 'admin123',
            role: 'admin',
            status: 'approved',
            createdAt: new Date().toISOString()
        },
        {
            id: 'user_farmer_001',
            name: 'John Farmer',
            email: 'farmer@farm.com',
            password: 'farmer123',
            role: 'farmer',
            status: 'approved',
            createdAt: new Date().toISOString()
        },
        {
            id: 'user_buyer_001',
            name: 'Jane Buyer',
            email: 'buyer@farm.com',
            password: 'buyer123',
            role: 'buyer',
            status: 'approved',
            createdAt: new Date().toISOString()
        }
    ];

    localStorage.setItem('users', JSON.stringify(dummyUsers));

    // Add some dummy products
    const dummyProducts = [
        {
            id: 'prod_001',
            name: 'Fresh Tomatoes',
            price: 4.99,
            category: 'vegetables',
            image: 'https://images.unsplash.com/photo-1592841696179-0d41d5ce06cc?w=400&h=300&fit=crop',
            description: 'Organic fresh tomatoes from local farm',
            farmerId: 'user_farmer_001',
            createdAt: new Date().toISOString()
        },
        {
            id: 'prod_002',
            name: 'Organic Spinach',
            price: 3.49,
            category: 'vegetables',
            image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
            description: 'Fresh organic spinach bunches',
            farmerId: 'user_farmer_001',
            createdAt: new Date().toISOString()
        },
        {
            id: 'prod_003',
            name: 'Sweet Mangoes',
            price: 5.99,
            category: 'fruits',
            image: 'https://images.unsplash.com/photo-1585518419759-87c21c1bd0e8?w=400&h=300&fit=crop',
            description: 'Delicious sweet mangoes, perfect for summer',
            farmerId: 'user_farmer_001',
            createdAt: new Date().toISOString()
        },
        {
            id: 'prod_004',
            name: 'Fresh Carrots',
            price: 2.99,
            category: 'vegetables',
            image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop',
            description: 'Orange organic carrots',
            farmerId: 'user_farmer_001',
            createdAt: new Date().toISOString()
        },
        {
            id: 'prod_005',
            name: 'Farm Fresh Milk',
            price: 3.99,
            category: 'dairy',
            image: 'https://images.unsplash.com/photo-1550080876-f3d33de3b46a?w=400&h=300&fit=crop',
            description: 'Pure farm fresh milk',
            farmerId: 'user_farmer_001',
            createdAt: new Date().toISOString()
        },
        {
            id: 'prod_006',
            name: 'Wheat Grains',
            price: 8.99,
            category: 'grains',
            image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop',
            description: 'Premium wheat grains for bread',
            farmerId: 'user_farmer_001',
            createdAt: new Date().toISOString()
        }
    ];

    localStorage.setItem('products', JSON.stringify(dummyProducts));
}

function setupEventListeners() {
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const sidebar = document.getElementById('sidebar');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            if (sidebar) {
                sidebar.classList.toggle('active');
            } else if (navMenu) {
                navMenu.classList.toggle('active');
            }
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Close sidebar button
    const closeSidebar = document.getElementById('closeSidebar');
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function() {
            if (sidebar) {
                sidebar.classList.remove('active');
            }
        });
    }

    // Modal close on backdrop click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

/* ============================================
   THEME MANAGEMENT
   ============================================ */

function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    applyTheme(theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}

function applyTheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');

    if (theme === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    } else {
        body.classList.remove('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
}

/* ============================================
   AUTHENTICATION FUNCTIONS
   ============================================ */

function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        document.getElementById('generalError').textContent = 'Invalid email or password';
        return;
    }

    if (user.status === 'rejected') {
        document.getElementById('generalError').textContent = 'Your account has been rejected';
        return;
    }

    if (user.status === 'pending') {
        document.getElementById('generalError').textContent = 'Your account is pending approval';
        return;
    }

    // Login successful
    localStorage.setItem('currentUser', JSON.stringify(user));
    showToast('Login successful! Redirecting...', 'success');

    setTimeout(() => {
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
        } else if (user.role === 'farmer') {
            window.location.href = 'farmer.html';
        } else if (user.role === 'buyer') {
            window.location.href = 'buyer.html';
        }
    }, 800);
}

function registerUser(name, email, password, role) {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        document.getElementById('generalError').textContent = 'Email already registered';
        return;
    }

    const newUser = {
        id: 'user_' + Date.now(),
        name,
        email,
        password,
        role,
        status: 'approved',
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    showToast('Registration successful! Redirecting to login...', 'success');

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 800);
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    showToast('Logged out successfully', 'success');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

/* ============================================
   ROUTE PROTECTION
   ============================================ */

function protectRoute(requiredRole) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    if (currentUser.role !== requiredRole) {
        if (currentUser.role === 'admin') {
            window.location.href = 'admin.html';
        } else if (currentUser.role === 'farmer') {
            window.location.href = 'farmer.html';
        } else if (currentUser.role === 'buyer') {
            window.location.href = 'buyer.html';
        } else {
            window.location.href = 'login.html';
        }
    }
}

/* ============================================
   NOTIFICATION SYSTEM
   ============================================ */

function showToast(message, type = 'info') {
    const toastElement = document.getElementById('toast');
    if (!toastElement) return;

    toastElement.textContent = message;
    toastElement.className = 'toast ' + type;
    toastElement.style.display = 'block';

    setTimeout(() => {
        toastElement.style.display = 'none';
    }, 3000);
}

function showLoader(show = true) {
    let loader = document.getElementById('loader');
    if (show) {
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loader';
            loader.className = 'loader';
            loader.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 5000;
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'block';
    } else if (loader) {
        loader.style.display = 'none';
    }
}

/* ============================================
   RESPONSIVE SIDEBAR
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    if (closeSidebar && sidebar) {
        closeSidebar.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
    }

    // Close sidebar when clicking menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth < 1024 && sidebar) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024 && sidebar) {
            sidebar.classList.remove('active');
        }
    });
});

/* ============================================
   SMOOTH SCROLLING
   ============================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ============================================
   SCROLL REVEAL ANIMATION
   ============================================ */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .product-card, .order-card, .stat-card').forEach(el => {
    observer.observe(el);
});

/* ============================================
   FORM VALIDATION HELPERS
   ============================================ */

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password && password.length >= 6;
}

/* ============================================
   MODAL UTILITIES
   ============================================ */

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList && e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2);
}

function generateId(prefix = 'id') {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/* ============================================
   EXPORT FUNCTIONS FOR GLOBAL USE
   ============================================ */

// These are exported to be used inline in HTML

window.loginUser = loginUser;
window.registerUser = registerUser;
window.logout = logout;
window.protectRoute = protectRoute;
window.showToast = showToast;
window.showLoader = showLoader;
window.toggleTheme = toggleTheme;
window.openModal = openModal;
window.closeModal = closeModal;
window.validateEmail = validateEmail;
window.validatePassword = validatePassword;
window.formatDate = formatDate;
window.formatCurrency = formatCurrency;

// Export dashboard utilities
window.showSection = function() {};  // Overridden in specific pages
window.updateFarmerStats = function() {};
window.updateCartCount = function() {};
window.toggleCart = function() {};
window.addToCart = function() {};
window.removeFromCart = function() {};
window.placeOrder = function() {};
window.updateOrderStatus = function() {};
window.editProduct = function() {};
window.deleteProduct = function() {};
window.deleteProductAdmin = function() {};
window.viewUserDetails = function() {};
window.approveUser = function() {};
window.rejectUser = function() {};
window.deleteUser = function() {};
window.filterUsers = function() {};
window.filterProducts = function() {};
window.filterProductsAdmin = function() {};

/* ============================================
   V2.0 FEATURES - NOTIFICATION SYSTEM
   ============================================ */

function createNotification(userId, message, type = 'info') {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.push({
        id: 'notif_' + Date.now(),
        userId,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

function getUnreadNotifications(userId) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    return notifications.filter(n => n.userId === userId && !n.read);
}

function markNotificationAsRead(notificationId) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const notif = notifications.find(n => n.id === notificationId);
    if (notif) {
        notif.read = true;
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }
}

/* ============================================
   V2.0 FEATURES - WISHLIST SYSTEM
   ============================================ */

function addToWishlist(productId, userId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    const exists = wishlist.some(w => w.userId === userId && w.productId === productId);
    if (!exists) {
        wishlist.push({
            userId,
            productId,
            addedAt: new Date().toISOString()
        });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showToast('Added to wishlist!', 'success');
        return true;
    }
    return false;
}

function removeFromWishlist(productId, userId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(w => !(w.userId === userId && w.productId === productId));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function isInWishlist(productId, userId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlist.some(w => w.userId === userId && w.productId === productId);
}

/* ============================================
   V2.0 FEATURES - PRODUCT RATINGS & REVIEWS
   ============================================ */

function addProductReview(productId, userId, rating, comment) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        if (!products[productIndex].reviews) {
            products[productIndex].reviews = [];
        }

        products[productIndex].reviews.push({
            userId,
            rating: parseInt(rating),
            comment,
            date: new Date().toISOString()
        });

        // Update average rating
        const avgRating = products[productIndex].reviews.reduce((sum, r) => sum + r.rating, 0) / products[productIndex].reviews.length;
        products[productIndex].averageRating = Math.round(avgRating * 10) / 10;

        localStorage.setItem('products', JSON.stringify(products));
        showToast('Review added successfully!', 'success');
        return true;
    }
    return false;
}

function getProductReviews(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    return product ? (product.reviews || []) : [];
}

function getAverageRating(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    return product ? (product.averageRating || 0) : 0;
}

/* ============================================
   V2.0 FEATURES - COUPON SYSTEM
   ============================================ */

function initializeCoupons() {
    const existingCoupons = localStorage.getItem('coupons');
    if (!existingCoupons) {
        const defaultCoupons = [
            { code: 'FARM10', discount: 10, description: '10% Off' },
            { code: 'NEWUSER', discount: 5, description: '5% Off for New Users' },
            { code: 'GREEN20', discount: 20, description: '20% Seasonal Discount' }
        ];
        localStorage.setItem('coupons', JSON.stringify(defaultCoupons));
    }
}

function validateCoupon(couponCode) {
    const coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    return coupons.find(c => c.code === couponCode.toUpperCase());
}

function applyCoupon(couponCode, subtotal) {
    const coupon = validateCoupon(couponCode);
    if (coupon) {
        const discountAmount = (subtotal * coupon.discount) / 100;
        localStorage.setItem('discountInfo', JSON.stringify({
            code: coupon.code,
            amount: discountAmount,
            percentage: coupon.discount
        }));
        showToast(`Coupon applied! ${coupon.discount}% off`, 'success');
        return discountAmount;
    } else {
        showToast('Invalid coupon code', 'error');
        return 0;
    }
}

function removeCoupon() {
    localStorage.removeItem('discountInfo');
    showToast('Coupon removed', 'info');
}

/* ============================================
   V2.0 FEATURES - ORDER TRACKING
   ============================================ */

function getOrderTrackingSteps() {
    return [
        { step: 1, label: 'Order Placed', icon: '🛒' },
        { step: 2, label: 'Payment Confirmed', icon: '💳' },
        { step: 3, label: 'Admin Approved', icon: '🛠' },
        { step: 4, label: 'Farmer Approved', icon: '🌾' },
        { step: 5, label: 'Shipped', icon: '🚚' },
        { step: 6, label: 'Delivered', icon: '📦' }
    ];
}

function updateOrderTrackingStep(orderId, newStep) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex !== -1) {
        orders[orderIndex].trackingStep = newStep;
        orders[orderIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('orders', JSON.stringify(orders));
        return true;
    }
    return false;
}

/* ============================================
   V2.0 FEATURES - FARMER VERIFICATION
   ============================================ */

function verifyFarmer(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        users[userIndex].verified = true;
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    return false;
}

function unverifyFarmer(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        users[userIndex].verified = false;
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    return false;
}

/* ============================================
   V2.0 FEATURES - ORDER CANCELLATION
   ============================================ */

function requestOrderCancellation(orderId, reason) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex !== -1) {
        const order = orders[orderIndex];
        
        // Can only cancel before shipping
        if (order.trackingStep <= 4) {
            order.cancellationStatus = 'requested';
            order.cancellationReason = reason;
            localStorage.setItem('orders', JSON.stringify(orders));

            // Create notification
            createNotification(order.buyerId, `Your cancellation request for order #${orderId.substring(0, 8)} is pending approval`);

            showToast('Cancellation request submitted', 'success');
            return true;
        } else {
            showToast('Cannot cancel order that has already shipped', 'error');
            return false;
        }
    }
    return false;
}

function approveCancellation(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex !== -1) {
        orders[orderIndex].cancellationStatus = 'approved';
        orders[orderIndex].orderStatus = 'Cancelled';
        localStorage.setItem('orders', JSON.stringify(orders));

        createNotification(orders[orderIndex].buyerId, `Your order #${orderId.substring(0, 8)} has been cancelled`);
        showToast('Order cancellation approved', 'success');
        return true;
    }
    return false;
}

function rejectCancellation(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex !== -1) {
        orders[orderIndex].cancellationStatus = 'rejected';
        localStorage.setItem('orders', JSON.stringify(orders));

        createNotification(orders[orderIndex].buyerId, `Your cancellation request for order #${orderId.substring(0, 8)} has been rejected`);
        showToast('Cancellation request rejected', 'success');
        return true;
    }
    return false;
}

/* ============================================
   V2.0 FEATURES - ADVANCED SORTING & FILTERING
   ============================================ */

function sortProducts(products, sortBy) {
    const sorted = [...products];

    switch(sortBy) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'rating':
            sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
            break;
        default:
            return products;
    }

    return sorted;
}

function filterProductsByPriceRange(products, minPrice, maxPrice) {
    return products.filter(p => p.price >= minPrice && p.price <= maxPrice);
}

/* ============================================
   V2.0 FEATURES - ANIMATED COUNTERS
   ============================================ */

function animateCounter(element, targetValue, duration = 1000) {
    const increment = targetValue / (duration / 16);
    let currentValue = 0;

    const updateCounter = () => {
        currentValue += increment;
        if (currentValue < targetValue) {
            element.textContent = Math.floor(currentValue);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetValue;
        }
    };

    updateCounter();
}

/* ============================================
   V2.0 FEATURES - EXTENDED INITIALIZATION
   ============================================ */

// Call extended initialization
initializeCoupons();
window.initializeCoupons = initializeCoupons;
window.validateCoupon = validateCoupon;
window.applyCoupon = applyCoupon;
window.removeCoupon = removeCoupon;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.isInWishlist = isInWishlist;
window.addProductReview = addProductReview;
window.getProductReviews = getProductReviews;
window.getAverageRating = getAverageRating;
window.createNotification = createNotification;
window.getUnreadNotifications = getUnreadNotifications;
window.markNotificationAsRead = markNotificationAsRead;
window.getOrderTrackingSteps = getOrderTrackingSteps;
window.updateOrderTrackingStep = updateOrderTrackingStep;
window.verifyFarmer = verifyFarmer;
window.unverifyFarmer = unverifyFarmer;
window.requestOrderCancellation = requestOrderCancellation;
window.approveCancellation = approveCancellation;
window.rejectCancellation = rejectCancellation;
window.sortProducts = sortProducts;
window.filterProductsByPriceRange = filterProductsByPriceRange;
window.animateCounter = animateCounter;
