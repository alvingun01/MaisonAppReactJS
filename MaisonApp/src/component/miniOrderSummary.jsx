
import { CartService } from '../services/cartService';
import { useState, useEffect } from 'react';
import "../main.css";

export default function MiniOrderSummary({ cart }) {
    const formatCurrency = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
    };

    return (
        <div>
            <div className="order-summary">
                <div className="order-summary__title">Your Order</div>
                <div>
                    {
                        Object.values(cart).map((p) => (
                            <div className="summary-line" key={p.id}>
                                <span className="summary-line__label">{p.name} × {p.quantity}</span>
                                <span>{formatCurrency(CartService.getItemSubtotal(p))}</span>
                            </div>
                        ))
                    }
                </div>
                <div>
                    <div className="summary-line">
                        <span className="summary-line__label">Shipping</span>
                        <span>{formatCurrency(CartService.getShipping())}</span>
                    </div>
                </div>
                <div className="summary-line summary-line--total">
                    <span className="summary-line__label">Total</span>
                    <span>{formatCurrency(CartService.getTotal())}</span>
                </div>
            </div>
        </div>
    )
}