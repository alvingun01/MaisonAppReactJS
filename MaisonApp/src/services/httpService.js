const API_BASE_URL = "http://localhost:8001/api/";

const getHeaders = (includeAuth = true) => {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth) {
        const token = localStorage.getItem('authToken');
        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }
    }
    return headers;
};

export const HttpService = {
    async login(username, password) {
        const response = await fetch(`${API_BASE_URL}login/`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'Login failed');
        }
        return response.json();
    },

    async register(username, email, password) {
        const response = await fetch(`${API_BASE_URL}register/`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify({ username, email, password })
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'Registration failed');
        }
        return response.json();
    },

    async logout(token) {
        const response = await fetch(`${API_BASE_URL}logout/`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify({ token })
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'Logout failed');
        }
        return response.json().catch(() => ({}));
    },

    async getProducts() {
        const response = await fetch(`${API_BASE_URL}products/`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    },

    async getProductById(id) {
        const response = await fetch(`${API_BASE_URL}products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        return response.json();
    },

    async getOrders() {
        const response = await fetch(`${API_BASE_URL}orders`, {
            headers: getHeaders(true)
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },

    async createOrder(order) {
        const response = await fetch(`${API_BASE_URL}orders`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(order)
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errMsg = errData.message || JSON.stringify(errData) || `Status: ${response.status}`;
            throw new Error(`Failed to create order: ${errMsg}`);
        }
        return response.json();
    },

    async updateOrder(order) {
        const response = await fetch(`${API_BASE_URL}orders/${order.id}`, {
            method: 'PUT',
            headers: getHeaders(true),
            body: JSON.stringify(order)
        });
        if (!response.ok) throw new Error('Failed to update order');
        return response.json();
    },

    async deleteOrder(id) {
        const response = await fetch(`${API_BASE_URL}orders/${id}`, {
            method: 'DELETE',
            headers: getHeaders(true)
        });
        if (!response.ok) throw new Error('Failed to delete order');
        return response.json().catch(() => ({}));
    },

    async createProducts(product) {
        const response = await fetch(`${API_BASE_URL}products`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(product)
        });
        if (!response.ok) throw new Error('Failed to create product');
        return response.json();
    },

    async updateProducts(product) {
        const response = await fetch(`${API_BASE_URL}products/${product.id}`, {
            method: 'PUT',
            headers: getHeaders(true),
            body: JSON.stringify(product)
        });
        if (!response.ok) throw new Error('Failed to update product');
        return response.json();
    },

    async deleteProducts(id) {
        const response = await fetch(`${API_BASE_URL}products/${id}`, {
            method: 'DELETE',
            headers: getHeaders(true)
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return response.json().catch(() => ({}));
    },

    async getCart() {
        const response = await fetch(`${API_BASE_URL}cart`, {
            headers: getHeaders(true)
        });
        if (!response.ok) throw new Error('Failed to fetch cart');
        return response.json();
    },

    async createCart(cart) {
        const response = await fetch(`${API_BASE_URL}cart`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(cart)
        });
        if (!response.ok) throw new Error('Failed to create cart');
        return response.json();
    },

    async updateCart(id, cart) {
        const response = await fetch(`${API_BASE_URL}cart/${id}`, {
            method: 'PUT',
            headers: getHeaders(true),
            body: JSON.stringify(cart)
        });
        if (!response.ok) throw new Error('Failed to update cart');
        return response.json();
    },

    async deleteCart(id) {
        const response = await fetch(`${API_BASE_URL}cart/${id}`, {
            method: 'DELETE',
            headers: getHeaders(true)
        });
        if (!response.ok) throw new Error('Failed to delete cart');
        return response.json().catch(() => ({}));
    },

    async getWishlist() {
        const response = await fetch(`${API_BASE_URL}wishlist`, {
            headers: getHeaders(true)
        });
        if (!response.ok) throw new Error('Failed to fetch wishlist');
        return response.json();
    },

    async createWishlist(wishlist) {
        const response = await fetch(`${API_BASE_URL}wishlist`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(wishlist)
        });
        if (!response.ok) throw new Error('Failed to create wishlist');
        return response.json();
    },

    async updateWishlist(id, wishlist) {
        const response = await fetch(`${API_BASE_URL}wishlist/${id}`, {
            method: 'PUT',
            headers: getHeaders(true),
            body: JSON.stringify(wishlist)
        });
        if (!response.ok) throw new Error('Failed to update wishlist');
        return response.json();
    },

    async deleteWishlist(id) {
        const response = await fetch(`${API_BASE_URL}wishlist/${id}`, {
            method: 'DELETE',
            headers: getHeaders(true)
        });
        if (!response.ok) throw new Error('Failed to delete wishlist');
        return response.json().catch(() => ({}));
    }
};
