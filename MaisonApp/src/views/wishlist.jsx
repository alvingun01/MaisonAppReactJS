import WishlistCardComponent from "../component/wishlistCardComponent";
import { useCart } from '../hooks/useCart';
import { Link } from "react-router-dom";
import "../main.css";
import { useWishlist } from "../hooks/useWishlist";
export default function Wishlist() {
    const { addToCart } = useCart();
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const handleRemoveFromWishlist = (product) => {
        removeFromWishlist(product);
    };
    const moveToCart = function (product) {
        addToCart(product, 1);
        removeFromWishlist(product);
    };
    const getWishlistCount = function () {
        return Object.keys(wishlist).length;
    };
    return (
        <main>
            <div className="page-hero">
                <div className="page-hero__eyebrow">Saved Objects</div>
                <h1 className="page-hero__title">Your <em>Wishlist</em></h1>
                <p className="page-hero__sub">{getWishlistCount()} saved</p>
            </div>
            {getWishlistCount() === 0 && (
                <div className="empty-state" id="wishlist-empty">
                    <div className="empty-state__glyph">♡</div>
                    <div className="empty-state__title">Your wishlist is empty</div>
                    <p className="empty-state__sub">
                        Tap the heart on any product to save it here for later.
                    </p>
                    <Link to="/catalog" className="btn btn-outline">Browse the Catalog</Link>
                </div>
            )}
            {getWishlistCount() > 0 && (
                <div className="wishlist-grid" ng-show="getWishlistCount() > 0">
                    <div className="product-grid product-grid--3">
                        {Object.values(wishlist).map((product) => (
                            <WishlistCardComponent key={product.id}
                                product={product}
                                handleMoveToCart={() => moveToCart(product)}
                                handleRemoveFromWishlist={() => handleRemoveFromWishlist(product)}>
                            </WishlistCardComponent>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}