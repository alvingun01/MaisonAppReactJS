import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const formatCurrency = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
};

export default function Cart() {
    const {
        cart,
        subtotal,
        shipping,
        discount,
        total,
        shippingRemaining,
        promoCode: appliedPromoCode,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        applyPromo,
        getItemSubtotal
    } = useCart();

    const [promoInput, setPromoInput] = useState('');

    const cartItems = Object.values(cart);
    const hasItems = cartItems.length > 0;

    return (
        <main>
            <div className="page-hero">
                <div className="page-hero__eyebrow">Your Selections</div>
                <h1 className="page-hero__title">Shopping <em>Cart</em></h1>
                <p className="page-hero__sub">{cartItems.length} items selected</p>
            </div>

            {!hasItems ? (
                <div className="empty-state">
                    <div className="empty-state__glyph">◻</div>
                    <div className="empty-state__title">Your cart is empty</div>
                    <p className="empty-state__sub">
                        Explore our catalog and find objects you'll love for years.
                    </p>
                    <Link to="/catalog" className="btn btn-outline">Browse the Catalog</Link>
                </div>
            ) : (
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
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item__product">
                                        <div className="cart-item__img">{item.emoji}</div>
                                        <div>
                                            <Link to={`/product/${item.id}`} className="cart-item__name">{item.name}</Link>
                                            <div className="cart-item__meta">{item.category}</div>
                                            <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-item__price">{formatCurrency(item.price)}</div>
                                    <div className="cart-item__actions">
                                        <div className="qty-picker">
                                            <button className="qty-btn-dec" onClick={() => decreaseQuantity(item.id)}>−</button>
                                            <div className="qty-picker__val">{item.quantity}</div>
                                            <button className="qty-btn-inc" onClick={() => increaseQuantity(item.id)}>+</button>
                                        </div>
                                    </div>
                                    <div className="cart-item__subtotal" style={{ textAlign: 'right' }}>
                                        {formatCurrency(getItemSubtotal(item))}
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
                                        placeholder="e.g. WELCOME10" value={promoInput} onChange={(e) => { setPromoInput(e.target.value); }}
                                    />
                                    <button className="btn btn-outline" onClick={(e) => { applyPromo(promoInput); }}>
                                        Apply
                                    </button>
                                </div>
                                <p style={{
                                    fontSize: '11px',
                                    color: 'var(--warm-mid)',
                                    marginTop: '0.5rem'
                                }}>
                                    Try: WELCOME10 · SUMMER15
                                </p>
                            </div>
                        </div>

                        <div className="order-summary">
                            <div className="order-summary__title">Order Summary</div>

                            <div className="summary-line">
                                <span className="summary-line__label">Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>

                            {appliedPromoCode && (
                                <div className="summary-line">
                                    <span className="summary-line__label" style={{ color: 'var(--accent2)' }}>Discount ({appliedPromoCode})</span>
                                    <span style={{ color: 'var(--accent2)' }}>− {formatCurrency(discount)}</span>
                                </div>
                            )}

                            <div className="summary-line">
                                <span className="summary-line__label">Shipping</span>
                                <span>{formatCurrency(shipping)}</span>
                            </div>

                            <div className="summary-line summary-line--total">
                                <span className="summary-line__label">Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>

                            {shippingRemaining > 0 && (
                                <p style={{ fontSize: '11px', color: 'var(--warm-mid)', margin: '1rem 0' }}>
                                    Add <span>{formatCurrency(shippingRemaining)}</span> more for free shipping
                                </p>
                            )}

                            <Link to="/checkout" className="btn btn-primary btn-full" style={{ marginTop: '1rem', padding: '14px' }}>
                                Proceed to Checkout →
                            </Link>
                            <Link to="/catalog" className="btn btn-ghost btn-full" style={{ marginTop: '0.5rem' }}>
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}