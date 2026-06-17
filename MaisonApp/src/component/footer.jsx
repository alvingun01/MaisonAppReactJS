import { Link, useLocation } from 'react-router-dom';
import "../main.css"

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer__inner">
                <div className="footer__brand">
                    <div className="footer__logo">MAISON</div>
                    <p>Curated objects for the considered life.</p>
                </div>
                <div className="footer__links">
                    <div>
                        <strong>Shop</strong>
                        <Link to="/">Home</Link>
                        <Link to="/catalog">All Products</Link>
                        <Link to="/cart">Cart</Link>
                    </div>
                    <div>
                        <strong>Account</strong>
                        <Link to="/wishlist">Wishlist</Link>
                        <Link to="/orders">Orders</Link>
                    </div>
                </div>
                <div className="footer__copy">
                    <p>&copy; 2026 MAISON. All objects reserved.</p>
                    <p>Prices are in USD. All data stored locally.</p>
                </div>
            </div>
        </footer>
    );
}