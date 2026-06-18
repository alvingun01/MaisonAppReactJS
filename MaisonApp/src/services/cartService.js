import { HttpService } from "./httpService";

// State and configuration at module scope
let cart = {};
let shippingCost = JSON.parse(localStorage.getItem("shippingCost")) || 18;
let shippingThreshold = JSON.parse(localStorage.getItem("shippingThreshold")) || 100;
let promos = JSON.parse(localStorage.getItem("promo")) || {
    "WELCOME10": 0.10, // 10% discount
    "SUMMER15": 0.15   // 15% discount
};
let promoCode = localStorage.getItem("applied_promo") || "";
let promo = (promos && promoCode) ? promos[promoCode] : null;

// Helper to check login status
const isLoggedIn = () => !!localStorage.getItem("authToken");

// Helper to persist/load local cart for guests
const saveCartLocal = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

const loadCartLocal = () => {
    try {
        cart = JSON.parse(localStorage.getItem("cart")) || {};
    } catch (e) {
        cart = {};
    }
};

// Helper to notify other components of cart updates
const notifyCartUpdate = () => {
    window.dispatchEvent(new Event("cart-updated"));
};

// Initialize local cart cache
loadCartLocal();

export const CartService = {
    getCart() {
        return cart;
    },

    getShippingCost() {
        return shippingCost;
    },

    getShippingThreshold() {
        return shippingThreshold;
    },

    getPromoCode() {
        return promoCode;
    },

    async loadCart() {
        if (isLoggedIn()) {
            try {
                // Fetch products and cart items in parallel
                const [products, cartItems] = await Promise.all([
                    HttpService.getProducts(),
                    HttpService.getCartItems()
                ]);

                // Create a product lookup table for fast access
                const productLookup = {};
                if (Array.isArray(products)) {
                    products.forEach(p => {
                        productLookup[p.id] = p;
                    });
                }

                // Map database cart items into full cart objects with product details
                const loadedCart = {};
                if (Array.isArray(cartItems)) {
                    cartItems.forEach(item => {
                        const prodDetails = productLookup[item.product];
                        if (prodDetails) {
                            loadedCart[item.product] = {
                                ...prodDetails,
                                dbId: item.id,
                                quantity: item.quantity,
                                selectedSize: item.selected_size
                            };
                        }
                    });
                }

                cart = loadedCart;
                notifyCartUpdate();
                return cart;
            } catch (error) {
                console.error('Error fetching cart from database:', error);
                throw error;
            }
        } else {
            loadCartLocal();
            // If the user is on the cart page but not logged in, redirect them to login
            const currentPath = window.location.pathname;
            if (currentPath === "/cart" || window.location.hash.includes("/cart")) {
                window.location.href = "/login";
            }
            notifyCartUpdate();
            return cart;
        }
    },

    async removeFromCart(productId) {
        const item = cart[productId];
        if (!item) return cart;

        if (isLoggedIn() && item.dbId) {
            try {
                await HttpService.deleteCartItem(item.dbId);
                delete cart[productId];
            } catch (error) {
                console.error('Error removing cart item from database:', error);
                throw error;
            }
        } else {
            delete cart[productId];
            saveCartLocal();
        }
        notifyCartUpdate();
        return cart;
    },

    async increaseQuantity(productId) {
        const item = cart[productId];
        if (!item) return cart;

        if (isLoggedIn() && item.dbId) {
            const nextQty = item.quantity + 1;
            const updatePayload = {
                id: item.dbId,
                product: productId,
                quantity: nextQty,
                selected_size: item.selectedSize || ""
            };
            try {
                await HttpService.updateCartItem(updatePayload);
                cart[productId].quantity = nextQty;
            } catch (error) {
                console.error('Error updating cart item quantity:', error);
                throw error;
            }
        } else {
            cart[productId].quantity++;
            saveCartLocal();
        }
        notifyCartUpdate();
        return cart;
    },

    async decreaseQuantity(productId) {
        const item = cart[productId];
        if (!item) return cart;

        if (item.quantity > 1) {
            if (isLoggedIn() && item.dbId) {
                const nextQty = item.quantity - 1;
                const updatePayload = {
                    id: item.dbId,
                    product: productId,
                    quantity: nextQty,
                    selected_size: item.selectedSize || ""
                };
                try {
                    await HttpService.updateCartItem(updatePayload);
                    cart[productId].quantity = nextQty;
                } catch (error) {
                    console.error('Error updating cart item quantity:', error);
                    throw error;
                }
            } else {
                cart[productId].quantity--;
                saveCartLocal();
            }
        } else {
            await this.removeFromCart(productId);
        }
        notifyCartUpdate();
        return cart;
    },

    getCartCount() {
        let count = 0;
        Object.values(cart).forEach(item => {
            count += item.quantity;
        });
        return count;
    },

    getSubtotal() {
        let subtotal = 0;
        Object.values(cart).forEach(item => {
            subtotal += parseFloat(item.price || 0) * item.quantity;
        });
        return subtotal;
    },

    async clearCart() {
        if (isLoggedIn()) {
            const itemsToDelete = Object.values(cart);
            try {
                await Promise.all(itemsToDelete.map(item => {
                    if (item.dbId) {
                        return HttpService.deleteCartItem(item.dbId);
                    }
                    return Promise.resolve();
                }));
                cart = {};
            } catch (error) {
                console.error('Error clearing cart:', error);
                throw error;
            }
        } else {
            cart = {};
            saveCartLocal();
        }
        notifyCartUpdate();
        return cart;
    },

    getItemSubtotal(item) {
        return parseFloat(item.price || 0) * item.quantity;
    },

    getShipping() {
        return this.getSubtotal() >= shippingThreshold ? 0 : shippingCost;
    },

    getDiscount() {
        return promo ? this.getSubtotal() * promo : 0;
    },

    getTotal() {
        return this.getSubtotal() + this.getShipping() - this.getDiscount();
    },

    getShippingRemaining() {
        const subtotal = this.getSubtotal();
        return subtotal >= shippingThreshold ? 0 : shippingThreshold - subtotal;
    },

    async addToCart(product, qty = 1, selectedSize = "") {
        if (isLoggedIn()) {
            if (cart[product.id]) {
                const nextQty = cart[product.id].quantity + qty;
                const updatePayload = {
                    id: cart[product.id].dbId,
                    product: product.id,
                    quantity: nextQty,
                    selected_size: selectedSize || cart[product.id].selectedSize || ""
                };
                try {
                    await HttpService.updateCartItem(updatePayload);
                    cart[product.id].quantity = nextQty;
                    if (selectedSize) {
                        cart[product.id].selectedSize = selectedSize;
                    }
                } catch (error) {
                    console.error('Error updating cart item on add:', error);
                    throw error;
                }
            } else {
                const createPayload = {
                    product: product.id,
                    quantity: qty,
                    selected_size: selectedSize || ""
                };
                try {
                    const response = await HttpService.createCartItem(createPayload);
                    cart[product.id] = {
                        ...product,
                        dbId: response.id || response.data?.id,
                        quantity: qty,
                        selectedSize: selectedSize
                    };
                } catch (error) {
                    console.error('Error creating cart item on add:', error);
                    throw error;
                }
            }
        } else {
            if (cart[product.id]) {
                cart[product.id].quantity += qty;
            } else {
                cart[product.id] = {
                    ...product,
                    quantity: qty,
                    selectedSize: selectedSize
                };
            }
            if (selectedSize) {
                cart[product.id].selectedSize = selectedSize;
            }
            saveCartLocal();
        }
        notifyCartUpdate();
        return cart;
    },

    applyPromo(code) {
        if (promos && code in promos) {
            promo = promos[code];
            promoCode = code;
            localStorage.setItem("applied_promo", code);
            notifyCartUpdate();
            return true;
        }
        return false;
    }
};