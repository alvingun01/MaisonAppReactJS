import React, { createContext, useContext, useState, useEffect } from 'react';
import { HttpService } from '../services/httpService';
import { useDebouncedCallback } from 'use-debounce';

const CartContext = createContext();

const PROMOS = {
    "WELCOME10": 0.10, // 10% discount
    "SUMMER15": 0.15   // 15% discount
};

const isLoggedIn = () => !!localStorage.getItem("authToken");

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        if (!isLoggedIn()) {
            try {
                return JSON.parse(localStorage.getItem("cart")) || {};
            } catch (e) {
                return {};
            }
        }
        return {};
    });
    const [cartId, setCartId] = useState(null);
    const [cartCount, setCartCount] = useState(() => {
        if (!isLoggedIn()) {
            try {
                const local = JSON.parse(localStorage.getItem("cart")) || {};
                let count = 0;
                Object.values(local).forEach(item => {
                    count += item.quantity || 0;
                });
                return count;
            } catch (e) {
                return 0;
            }
        }
        return 0;
    });
    const [promoCode, setPromoCode] = useState(() => localStorage.getItem("applied_promo") || "");

    useEffect(() => {
        if (isLoggedIn()) {
            HttpService.getCart().then(async (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setCart(data[0].content || {});
                    setCartCount(data[0].cartCount || 0);
                    setCartId(data[0].id);
                } else {
                    try {
                        const newCart = await HttpService.createCart({ content: {}, cartCount: 0 });
                        setCart(newCart.content || {});
                        setCartCount(newCart.cartCount || 0);
                        setCartId(newCart.id);
                    } catch (e) {
                        console.error("Failed to create initial cart:", e);
                    }
                }
            }).catch(err => {
                console.error("Failed to fetch cart:", err);
            });
        }
    }, []);

    const persistCart = async (newCart, count) => {
        if (isLoggedIn()) {
            if (cartId) {
                try {
                    await HttpService.updateCart(cartId, { content: newCart, cartCount: count });
                } catch (e) {
                    console.error("Failed to save cart to backend:", e);
                }
            } else {
                try {
                    const data = await HttpService.getCart();
                    if (Array.isArray(data) && data.length > 0) {
                        setCartId(data[0].id);
                        await HttpService.updateCart(data[0].id, { content: newCart, cartCount: count });
                    } else {
                        const created = await HttpService.createCart({ content: newCart, cartCount: count });
                        setCartId(created.id);
                    }
                } catch (e) {
                    console.error("Failed to save cart to backend:", e);
                }
            }
        }
    };

    const debouncedSaveCart = useDebouncedCallback(persistCart, 500);

    const saveCart = async (newCart) => {
        let count = 0;
        Object.values(newCart).forEach(item => {
            count += item.quantity || 0;
        });

        setCart(newCart);
        setCartCount(count);

        localStorage.setItem("cart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("cart-updated"));

        debouncedSaveCart(newCart, count);
    };

    const addToCart = async (product, qty = 1, selectedSize = "") => {
        const newCart = { ...cart };
        if (newCart[product.id]) {
            newCart[product.id] = {
                ...newCart[product.id],
                quantity: newCart[product.id].quantity + qty,
                selectedSize: selectedSize || newCart[product.id].selectedSize || ""
            };
        } else {
            newCart[product.id] = {
                ...product,
                quantity: qty,
                selectedSize: selectedSize
            };
        }
        saveCart(newCart);
        return newCart;
    };

    const removeFromCart = (productId) => {
        const newCart = { ...cart };
        delete newCart[productId];
        saveCart(newCart);
        return newCart;
    };

    const increaseQuantity = async (productId) => {
        const newCart = { ...cart };
        if (newCart[productId]) {
            newCart[productId] = {
                ...newCart[productId],
                quantity: newCart[productId].quantity + 1
            };
            saveCart(newCart);
        }
        return newCart;
    };

    const decreaseQuantity = async (productId) => {
        const newCart = { ...cart };
        if (newCart[productId]) {
            if (newCart[productId].quantity > 1) {
                newCart[productId] = {
                    ...newCart[productId],
                    quantity: newCart[productId].quantity - 1
                };
                saveCart(newCart);
            } else {
                removeFromCart(productId);
            }
        }
        return newCart;
    };

    const clearCart = async () => {
        saveCart({});
        return {};
    };

    const applyPromo = (code) => {
        if (code in PROMOS) {
            setPromoCode(code);
            localStorage.setItem("applied_promo", code);
            window.dispatchEvent(new Event("cart-updated"));
            return true;
        }
        return false;
    };

    const getItemSubtotal = (item) => {
        return item.price * item.quantity;
    }

    // Derived values calculated on render
    const getSubtotal = () => {
        let val = 0;
        Object.values(cart).forEach(item => {
            val += parseFloat(item.price || 0) * (item.quantity || 0);
        });
        return val;
    };

    const subtotal = getSubtotal();
    const shippingThreshold = 100;
    const shippingCost = 18;
    const shipping = subtotal >= shippingThreshold ? 0 : shippingCost;
    const promoRate = PROMOS[promoCode] || 0;
    const discount = subtotal * promoRate;
    const total = subtotal + shipping - discount;
    const shippingRemaining = subtotal >= shippingThreshold ? 0 : shippingThreshold - subtotal;

    const value = {
        cart,
        cartCount,
        subtotal,
        shipping,
        discount,
        total,
        shippingRemaining,
        promoCode,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        applyPromo,
        getItemSubtotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
