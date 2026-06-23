import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OrderService } from "../services/orderService";

const formatCurrency = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
};

export default function Order() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        OrderService.getOrders()
            .then((data) => {
                setOrders(data || []);
                console.log(data)
            })
            .catch((error) => {
                console.error("Failed to load orders:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const deleteOrder = async (id) => {
        try {
            await OrderService.deleteOrder(id);
            setOrders((prev) => prev.filter((order) => order.id !== id));
        } catch (error) {
            console.error("Failed to delete order:", error);
        }
    };

    if (loading) {
        return (
            <main>
                <div className="page-hero">
                    <div className="page-hero__eyebrow">Purchase History</div>
                    <h1 className="page-hero__title">My <em>Orders</em></h1>
                </div>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--warm-mid)' }}>Loading your orders...</p>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="page-hero">
                <div className="page-hero__eyebrow">Purchase History</div>
                <h1 className="page-hero__title">My <em>Orders</em></h1>
            </div>

            <div className="orders-list" id="orders-list">
                {orders.length === 0 ? (
                    <div className="empty-state" id="orders-empty">
                        <div className="empty-state__glyph">◻</div>
                        <div className="empty-state__title">No orders yet</div>
                        <p className="empty-state__sub">
                            Once you place an order it will appear here. All order data is
                            stored in your browser.
                        </p>
                        <Link to="/catalog" className="btn btn-outline">Start Shopping</Link>
                    </div>
                ) : (
                    orders.map((order) => {
                        const firstName = order.first_name || (order.paymentInfo && order.paymentInfo.firstName) || '';
                        const lastName = order.last_name || (order.paymentInfo && order.paymentInfo.lastName) || '';
                        const city = order.city || (order.paymentInfo && order.paymentInfo.city) || '';
                        const country = order.country || (order.paymentInfo && order.paymentInfo.country) || '';

                        return (
                            <div key={order.id} className="order-card fade-in">
                                <div className="order-card__head">
                                    <div>
                                        <div className="order-card__label">Order ID</div>
                                        <div className="order-card__val" style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                                            {order.id}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="order-card__label">Date</div>
                                        <div className="order-card__val">
                                            {new Date(order.date).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="order-card__label">Total</div>
                                        <div className="order-card__val" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
                                            {formatCurrency(order.total)}
                                        </div>
                                    </div>
                                    <div>
                                        <button className="btn btn-outline" onClick={() => deleteOrder(order.id)}>Delete Order</button>
                                    </div>
                                </div>

                                <div className="order-card__items">
                                    {order.items && Object.keys(order.items).length > 0 && order.items.map((item) => (
                                        <div key={item.product} className="order-line">
                                            <span style={{ fontSize: '1.3rem', marginRight: '0.75rem' }}>{item.emoji}</span>
                                            <span className="order-line__name">{item.name}</span>
                                            <span className="order-line__qty" style={{ marginLeft: 'auto', marginRight: '1rem' }}>
                                                × {item.quantity}
                                            </span>
                                            <span className="order-line__price">
                                                {formatCurrency((parseFloat(item.price_at_purchase) || 0) * (item.quantity || 1))}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    padding: '0.875rem 1.5rem',
                                    borderTop: '1px solid var(--border)',
                                    background: 'var(--cream)',
                                    fontSize: '12px',
                                    color: 'var(--warm-mid)'
                                }}>
                                    Shipped to {firstName} {lastName}, {city}, {country}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </main>
    );
}