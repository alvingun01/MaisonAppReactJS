import { Link, useParams, useNavigate } from 'react-router-dom';
import Productcard from '../component/productcard';
import { useEffect, useState } from 'react';
import { HttpService } from '../services/httpService';
import { CartService } from '../services/cartService';

export default function ProductDetails() {
    let productId = useParams().id;
    const navigate = useNavigate();
    // const [currProduct, setCurrProduct] = useState(null);
    const [currProduct, setCurrProduct] = useState({});
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        HttpService.getProducts()
            .then(response => {
                setProducts(response);
                console.log(response);
                const found = response.find(p => p.product_id == productId || p.id == productId);
                if (found) {
                    setCurrProduct(found);
                }
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, [productId]);
    // if (!currProduct) {
    //     return (
    //         <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
    //             <p>Loading curated object...</p>
    //         </div>
    //     );
    // }
    const increaseQty = () => {
        if (quantity < 12) {
            setQuantity(quantity + 1);
        }
    };
    const formatCurrency = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
    };
    const decreaseQty = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const selectSize = (size) => {
        setSelectedSize(size);
    };

    const addToCart = (product, qty) => {
        CartService.addToCart(product, qty, selectedSize);
    };
    const buyNow = function (product, qty) {
        addToCart(product, qty);
        navigate('/cart');
    };

    const applyFilter = function (product) {
        if (product.id === productId) {
            return false;
        }
        return currProduct && product.category === currProduct.category;
    };

    const addToWishlist = function (product) {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "{}");
        if (!wishlist[product.id]) {
            wishlist[product.id] = product;
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            if (window.showToast) {
                window.showToast(`${product.name} added to wishlist!`);
            }
        }
    };
    return (
        <>
            <main>
                <div className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="breadcrumb__sep">›</span>
                    <Link to="/catalog">Catalog</Link>
                    <span className="breadcrumb__sep">›</span>
                    {/* <span>{currProduct.name}</span> */}
                </div>

                <div className="product-detail">
                    <div className="product-detail__img-wrap">{currProduct.emoji}</div>

                    <div>
                        <div className="product-detail__category">{currProduct.category}</div>
                        <h1 className="product-detail__name">{currProduct.name}</h1>

                        <div className="product-detail__rating">
                            <div className="rating-stars">
                                <span className="star star--filled">★</span>
                                <span className="star star--filled">★</span>
                                <span className="star star--filled">★</span>
                                <span className="star star--filled">★</span>
                                <span className="star star--filled">★</span>
                            </div>
                            <span className="rating-count">{currProduct.rating} · {currProduct.reviews} reviews</span>
                        </div>

                        <div className="product-detail__price">{formatCurrency(currProduct.price)}</div>

                        <p className="product-detail__desc">
                            {currProduct.desc}
                        </p>

                        <div>
                            {typeof currProduct.sizes === 'string' && (
                                <>
                                    <div className="detail-option-label">Size</div>
                                    <div className="size-options">
                                        {currProduct.sizes.split(',').map((size) => (
                                            <button
                                                key={size}
                                                className="size-btn"
                                                style={{ color: selectedSize == size ? 'var(--warm-soft)' : 'var(--warm)', backgroundColor: selectedSize == size ? 'var(--warm-mid)' : 'var(--warm-soft)' }}
                                                onClick={() => selectSize(size)}>
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="detail-option-label" style={{ marginTop: '1rem' }}>
                            Quantity
                        </div>
                        <div className="product-detail__actions">
                            <div className="qty-picker">
                                <button className="qty-btn" onClick={decreaseQty}>−</button>
                                <div className="qty-picker__val">{quantity}</div>
                                <button className="qty-btn" onClick={increaseQty}>+</button>
                            </div>

                            <button className="btn btn-primary" onClick={() => addToCart(currProduct, quantity)} style={{ flex: 1 }}>
                                Add to Cart
                            </button>

                            <button className="btn btn-accent" onClick={() => buyNow(currProduct, quantity)} style={{ flex: 1 }}>
                                Buy Now
                            </button>

                            <button className="btn btn-outline" onClick={() => addToWishlist(currProduct)} style={{ padding: '10px 14px' }} title="Wishlist">
                                ♡
                            </button>
                        </div>

                        <p style={{ fontSize: '12px', color: 'var(--warm-mid)', marginBottom: '1.5rem', marginTop: '1rem' }}>
                            ✓ In stock — ships in 3–5 days.
                        </p>

                        <div className="product-detail__meta">
                            <div className="meta-item">
                                <div className="meta-item__label">Material</div>
                                <div className="meta-item__value">{currProduct.material || 'N/A'}</div>
                            </div>
                            <div className="meta-item">
                                <div className="meta-item__label">Origin</div>
                                <div className="meta-item__value">{currProduct.origin || 'N/A'}</div>
                            </div>
                            <div className="meta-item">
                                <div className="meta-item__label">SKU</div>
                                <div className="meta-item__value">{currProduct.sku || 'N/A'}</div>
                            </div>
                            <div className="meta-item">
                                <div className="meta-item__label">Category</div>
                                <div className="meta-item__value">{currProduct.category}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'var(--cream2)', padding: '2px 0', marginTop: '4rem' }}>
                    <section className="section">
                        <div className="section__header">
                            <div>
                                <div className="section__eyebrow">From the Same Collection</div>
                                <h2 className="section__title">You May <em>Also Like</em></h2>
                            </div>
                        </div>
                        <div className="product-grid product-grid--3" id="related-grid">
                            {products.filter(applyFilter).map((product) => (
                                <Productcard key={product.id} product={product} addToCart={addToCart} addToWishlist={addToWishlist} />
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}