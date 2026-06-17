const API_BASE_URL = "http://localhost:8001/api/";

export const HttpService = {
    async login(username, password) {
        const response = await fetch(`${API_BASE_URL}login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
            headers: { 'Content-Type': 'application/json' },
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'Logout failed');
        }
        return response.json();
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
        const response = await fetch(`${API_BASE_URL}orders/`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },

    async createOrder(order) {
        const response = await fetch(`${API_BASE_URL}orders/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        if (!response.ok) throw new Error('Failed to create order');
        return response.json();
    },

    async updateOrder(order) {
        const response = await fetch(`${API_BASE_URL}orders/${order.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        if (!response.ok) throw new Error('Failed to update order');
        return response.json();
    },

    async deleteOrder(id) {
        const response = await fetch(`${API_BASE_URL}orders/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete order');
        return response.json();
    },

    async createProducts(product) {
        const response = await fetch(`${API_BASE_URL}products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        if (!response.ok) throw new Error('Failed to create product');
        return response.json();
    },

    async updateProducts(product) {
        const response = await fetch(`${API_BASE_URL}products/${product.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        if (!response.ok) throw new Error('Failed to update product');
        return response.json();
    },

    async deleteProducts(id) {
        const response = await fetch(`${API_BASE_URL}products/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return response.json();
    },

    async getCartItems() {
        const response = await fetch(`${API_BASE_URL}cart-items`);
        if (!response.ok) throw new Error('Failed to fetch cart items');
        return response.json();
    },

    async createCartItem(item) {
        const response = await fetch(`${API_BASE_URL}cart-items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        if (!response.ok) throw new Error('Failed to create cart item');
        return response.json();
    },

    async updateCartItem(item) {
        const response = await fetch(`${API_BASE_URL}cart-items/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        if (!response.ok) throw new Error('Failed to update cart item');
        return response.json();
    },

    async deleteCartItem(id) {
        const response = await fetch(`${API_BASE_URL}cart-items/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete cart item');
        return response.json();
    }
};
