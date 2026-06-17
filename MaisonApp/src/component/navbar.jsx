import { Link, useLocation } from 'react-router-dom';
import '../main.css';

function getCartCount() {
    return 0;
}

function getWishlistCount() {
    return 0;
}

export default function Navbar() {
    const location = useLocation();
    const currentPath = location.pathname;

    const isLoggedIn = () => false;
    const logout = () => console.log('logout');

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
                            {getWishlistCount() > 0 && (
                                <span className="nav-count" id="wishlist-count">{getWishlistCount()}</span>
                            )}
                        </Link>
                        <Link to="/cart" className={`cart-link ${currentPath === '/cart' ? 'active' : ''}`}>
                            Cart
                            <span className="cart-bubble" id="cart-count">{getCartCount()}</span>
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