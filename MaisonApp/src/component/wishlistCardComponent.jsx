import { Link } from "react-router-dom";

export default function WishlistCardComponent({ product, handleMoveToCart, handleRemoveFromWishlist }) {
    return (
        <div className="product-card fade-in">
            <div className="product-card__img-wrap">
                <Link to={`/product/${product.id}`} className="product-card__img">
                    {product.emoji}
                </Link>
                <div className="product-card__actions">
                    <button className="btn btn-primary" onClick={handleMoveToCart}>
                        Move to Cart
                    </button>
                </div>
            </div>
            <div className="product-card__info" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <div className="product-card__category">{product.category}</div>
                    <div className="product-card__name">
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </div>
                    <div className="product-card__price-row">
                        <span className="product-card__price">${product.price}</span>
                    </div>
                </div>
                <button className="btn btn-danger" style={{ padding: "8px 12px", flexShrink: 0 }}
                    onClick={handleRemoveFromWishlist}>
                    ✕
                </button>
            </div>
        </div>
    );
}