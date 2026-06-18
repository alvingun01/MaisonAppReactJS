import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CartService } from '../services/cartService';
import '../main.css';


export default function Navbar() {
    const location = useLocation();
    const currentPath = location.pathname;
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    const isLoggedIn = () => !!localStorage.getItem("authToken");
    const logout = () => {
        localStorage.removeItem("authToken");
        CartService.clearCart();
        window.location.href = "/";
    };

    useEffect(() => {
        const handleCartUpdate = () => {
            setCartCount(CartService.getCartCount());
        };

        window.addEventListener('cart-updated', handleCartUpdate);

        window.showToast = (message, isError = false) => {
            const toast = document.getElementById("toast");
            const toastMessage = document.getElementById("toast-message");
            const toastIcon = document.getElementById("toast-icon");
            if (toast && toastMessage) {
                toastMessage.textContent = message;
                if (isError) {
                    toast.classList.add("toast--error");
                    if (toastIcon) toastIcon.textContent = "✕";
                } else {
                    toast.classList.remove("toast--error");
                    if (toastIcon) toastIcon.textContent = "✓";
                }
                toast.classList.add("toast--visible");
                setTimeout(() => {
                    toast.classList.remove("toast--visible");
                }, 3000);
            }
        };

        CartService.loadCart()
            .then(() => {
                handleCartUpdate();
            })
            .catch(error => {
                console.error('Failed to load cart items initially:', error);
            });

        return () => {
            window.removeEventListener('cart-updated', handleCartUpdate);
            delete window.showToast;
        };
    }, []);

    return (
        <>
            <header className="site-header" >
                <div className="header__inner">
                    <nav className="header__nav-left">
                        <Link to="/" className={currentPath === '/' ? 'active' : ''}>Shop</Link>
                        <Link to="/catalog" className={currentPath === '/catalog' ? 'active' : ''}>Catalog</Link>
                    </nav>
                    <Link to="/" className="header__logo">MAISON</Link>
                    <nav className="header__nav-right">
                        {!isLoggedIn() && (
                            <Link to="/login" className={currentPath === '/login' ? 'active' : ''}>Login</Link>
                        )}
                        {isLoggedIn() && (
                            <button onClick={logout} className="btn-ghost">Logout</button>
                        )}
                        <Link to="/wishlist" className={currentPath === '/wishlist' ? 'active' : ''}>
                            Wishlist
                            {wishlistCount > 0 && (
                                <span className="nav-count" id="wishlist-count">{wishlistCount}</span>
                            )}
                        </Link>
                        <Link to="/cart" className={`cart-link ${currentPath === '/cart' ? 'active' : ''}`}>
                            Cart
                            <span className="cart-bubble">{cartCount}</span>
                        </Link>
                    </nav>
                </div>
            </header>

            <div className="toast-container">
                <div className="toast" id="toast">
                    <span className="toast__icon" id="toast-icon">✓</span>
                    <span id="toast-message"></span>
                </div>
            </div>
        </>
    );
}