import "../main.css"
import { Link } from "react-router-dom"

export default function Productcard({ product, addToCart, addToWishlist }) {
    return (
        <div className="product-card fade-in">
            <div className="product-card__img-wrap">
                <div className="product-card__img">{product.emoji}</div>
                <span className="product-card__badge badge--new">{product.badge}</span>
                <button className="product-card__wishlist" onClick={() => addToWishlist(product)} title="Add to Wishlist">
                    ♡
                </button>
                <div className="product-card__actions">
                    <button className="btn btn-primary" onClick={() => addToCart(product)}>
                        Add to Cart
                    </button>
                </div>
            </div>
            <div className="product-card__info">
                <div className="product-card__category">{product.category}</div>
                <div className="product-card__name">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </div>
                <div className="product-card__price-row">
                    <span className="product-card__price">${product.price}</span>
                </div>
                <div className="product-card__rating">
                    <span className="star star--filled">★</span><span className="star star--filled">★</span><span
                        className="star star--filled">★</span><span className="star star--filled">★</span><span
                            className="star star--filled">★</span>
                    <span style={{ fontSize: '11px', color: 'var(--warm-mid)', marginLeft: '4px' }}>{product.reviews}</span>
                </div>
            </div>
        </div>
    )

}
