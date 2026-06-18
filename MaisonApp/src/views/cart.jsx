import { useEffect, useState } from "react";
import { CartService } from "../services/cartService";
import { Link } from "react-router-dom";

const formatCurrency = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
};

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [promoCode, setPromoCode] = useState('');

    useEffect(() => {
        const handleCartUpdate = () => {
            setCart({ ...CartService.getCart() });
        };

        CartService.loadCart()
            .then(data => {
                setCart({ ...data });
            })
            .catch(error => {
                console.error('Failed to load cart:', error);
            });

        window.addEventListener('cart-updated', handleCartUpdate);
        return () => {
            window.removeEventListener('cart-updated', handleCartUpdate);
        };
    }, [])

    return (
        <main>
            <div className="page-hero">
                <div className="page-hero__eyebrow">Your Selections</div>
                <h1 className="page-hero__title">Shopping <em>Cart</em></h1>
                <p className="page-hero__sub">{Object.keys(cart).length} items selected</p>
            </div>

            <div className="empty-state" style={{ display: 'none' }}>
                <div className="empty-state__glyph">◻</div>
                <div className="empty-state__title">Your cart is empty</div>
                <p className="empty-state__sub">
                    Explore our catalog and find objects you'll love for years.
                </p>
                <a href="catalog.html" className="btn btn-outline">Browse the Catalog</a>
            </div>

            <div className="cart-layout">
                <div>
                    <div className="cart-table-head">
                        <span>Product</span>
                        <span>Unit Price</span>
                        <span>Quantity</span>
                        <span style={{ textAlign: 'right' }}>Total</span>
                    </div>

                    {/* Cart items list */}
                    <div>
                        {Object.values(cart).map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item__product">
                                    <div className="cart-item__img">{item.emoji}</div>
                                    <div>
                                        <Link to={`/product/${item.id}`} className="cart-item__name">{item.name}</Link>
                                        <div className="cart-item__meta">{item.category}</div>
                                        <button className="cart-item__remove" onClick={() => CartService.removeFromCart(item.id)}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                <div className="cart-item__price">{formatCurrency(item.price)}</div>
                                <div className="cart-item__actions">
                                    <div className="qty-picker">
                                        <button className="qty-btn-dec" onClick={() => CartService.decreaseQuantity(item.id)}>−</button>
                                        <div className="qty-picker__val">{item.quantity}</div>
                                        <button className="qty-btn-inc" onClick={() => CartService.increaseQuantity(item.id)}>+</button>
                                    </div>
                                </div>
                                <div className="cart-item__subtotal" style={{ textAlign: 'right' }}>
                                    {formatCurrency(CartService.getItemSubtotal(item))}
                                </div>
                            </div>
                        ))}


                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={{
                                fontSize: '11px',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: 'var(--warm-mid)',
                                marginBottom: '0.5rem'
                            }}>
                                Promo Code
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input className="form-control" style={{ maxWidth: '220px' }} type="text"
                                    placeholder="e.g. WELCOME20" onChange={(e) => { setPromoCode(e.target.value); }}
                                />
                                <button className="btn btn-outline" onClick={(e) => { CartService.applyPromo(promoCode); }}>
                                    Apply
                                </button>
                            </div>
                            <p style={{ fontSize: '12px', marginTop: '0.5rem', display: 'none' }}></p>
                            <p style={{
                                fontSize: '11px',
                                color: 'var(--warm-mid)',
                                marginTop: '0.5rem'
                            }}>
                                Try: MAISON10 · WELCOME20 · SAVE15
                            </p>
                        </div>
                    </div>

                    <div className="order-summary">
                        <div className="order-summary__title">Order Summary</div>

                        <div className="summary-line">
                            <span className="summary-line__label">Subtotal</span>
                            <span>{formatCurrency(CartService.getSubtotal())}</span>
                        </div>

                        <div className="summary-line" style={{ display: CartService.getPromoCode() !== '' ? 'block' : 'none' }}>
                            <span className="summary-line__label" style={{ color: 'var(--accent2)' }}>Discount</span>
                            <span style={{ color: 'var(--accent2)' }}>− {formatCurrency(CartService.getDiscount())}</span>
                        </div>

                        <div className="summary-line">
                            <span className="summary-line__label">Shipping</span>
                            <span>{formatCurrency(CartService.getShipping())}</span>
                        </div>

                        <div className="summary-line summary-line--total">
                            <span className="summary-line__label">Total</span>
                            <span>{formatCurrency(CartService.getTotal())}</span>
                        </div>

                        <p style={{ fontSize: '11px', color: 'var(--warm-mid)', margin: '1rem 0' }}>
                            Add <span>{formatCurrency(CartService.getShippingRemaining())}</span> more for free shipping
                        </p>

                        <Link to="/checkout" className="btn btn-primary btn-full" style={{ marginTop: '1rem', padding: '14px' }}>
                            Proceed to Checkout →
                        </Link>
                        <Link to="/catalog" className="btn btn-ghost btn-full" style={{ marginTop: '0.5rem' }}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}