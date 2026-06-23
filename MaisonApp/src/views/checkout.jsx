import "../main.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { OrderService } from "../services/orderService";
import MiniOrderSummary from "../component/miniOrderSummary";

export default function Checkout() {
    const { cart, shipping, subtotal, discount, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [order, setOrder] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [line1, setLine1] = useState("");
    const [line2, setLine2] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [country, setCountry] = useState("United States");
    const [ccNumber, setCcNumber] = useState("");
    const [ccName, setCcName] = useState("");
    const [ccExp, setCcExp] = useState("");
    const [ccCVV, setCcCVV] = useState("");
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [currPaymentMode, setCurrPaymentMode] = useState("card");
    const [addrError, setAddrError] = useState(false);
    const [paymentError, setPaymentError] = useState(false);
    const isAddrFormInvalid = !firstName || !lastName || !email || !line1 || !city || !zip || !country;
    const isPaymentFormInvalid = !ccNumber || !ccName || !ccExp || !ccCVV;



    useEffect(() => {
        OrderService.getOrders().then((orders) => {
            console.log("orders", orders);
        });
    }, [step]);

    const formatCurrency = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
    };
    const nextStep = function (e) {
        if (e) e.preventDefault();
        if (step === 1) {
            if (!firstName || !lastName || !email || !line1 || !city || !zip || !country) {
                setAddrError(true);
                return;
            }
            setAddrError(false);
            let currPaymentInfo = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                line1: line1,
                line2: line2,
                city: city,
                zip: zip,
                country: country,
                ccNumber: ccNumber,
                ccName: ccName,
                ccExp: ccExp,
                ccCVV: ccCVV,
                currPaymentMode: currPaymentMode,

            }
            setPaymentInfo(currPaymentInfo);
            setStep(2);
        } else if (step === 2) {
            if (!ccNumber || !ccName || !ccExp || !ccCVV) {
                setPaymentError(true);
                return;
            }
            console.log("cart", cart);
            setPaymentError(false);
            setOrder(OrderService.createOrder(cart, paymentInfo, shipping, subtotal, discount));
            clearCart();
            setStep(3);
        }
    }

    const prevStep = function () {
        if (step === 3) {
            setStep(2);
        } else if (step === 2) {
            setStep(1);
        }
    }
    const paymentMode = function (mode) {
        if (mode === "card") {
            setCurrPaymentMode("card")
        } else if (mode === "paypal") {
            setCurrPaymentMode("paypal")
        } else if (mode === "apple") {
            setCurrPaymentMode("apple")
        }
    }


    return (
        <main>
            <div style={{
                background: "var(--white)",
                borderBottom: "1px solid var(--border)",
                padding: "1.25rem 2.5rem"
            }}>
                <div style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 0
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div className={`checkout-section__num ${step === 1 ? 'checkout-section__num_active' : ''}`}>
                            1
                        </div>
                        <span style={{
                            fontSize: "12px",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "var(--black)"
                        }}>Delivery</span>
                    </div>
                    <div style={{
                        width: "40px",
                        height: "1px",
                        background: "var(--border)",
                        margin: "0 0.5rem"
                    }}></div>


                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div className={`checkout-section__num ${step === 2 ? 'checkout-section__num_active' : ''}`}>
                            2
                        </div>
                        <span style={{
                            fontSize: "12px",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "var(--warm-mid)"
                        }}>Payment</span>
                    </div>
                    <div style={{
                        width: "40px",
                        height: "1px",
                        background: "var(--border)",
                        margin: "0 0.5rem"
                    }}></div>


                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div className={`checkout-section__num ${step === 3 ? 'checkout-section__num_active' : ''}`}>
                            3
                        </div>
                        <span style={{
                            fontSize: "12px",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "var(--warm-mid)"
                        }}>Confirmed</span>
                    </div>
                </div>
            </div>


            <div className="checkout-layout" style={{ display: step === 1 ? "block" : "none" }}>
                <div>
                    <form name="addrForm" noValidate onSubmit={nextStep}>
                        <div className="checkout-section">
                            <div className="checkout-section__title">
                                <span className="checkout-section__num">1</span>
                                Delivery Address
                            </div>

                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="addr-first">First Name *</label>
                                    <input className="form-control" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="addr-last">Last Name *</label>
                                    <input className="form-control" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
                                </div>
                            </div>

                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="addr-email">Email *</label>
                                    <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="addr-phone">Phone</label>
                                    <input className="form-control" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="addr-line1">Address Line 1 *</label>
                                <input className="form-control" type="text" value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Street address" required />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="addr-line2">Address Line 2</label>
                                <input className="form-control" type="text" value={line2} onChange={(e) => setLine2(e.target.value)} placeholder="Apt, suite, etc. (optional)" />
                            </div>

                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="addr-city">City *</label>
                                    <input className="form-control" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="addr-zip">Postcode *</label>
                                    <input className="form-control" type="text" value={zip} onChange={(e) => setZip(e.target.value)} placeholder="Postcode" required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="addr-country">Country *</label>
                                <select className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} required>
                                    <option>United States</option>
                                    <option>United Kingdom</option>
                                    <option>Canada</option>
                                    <option>Australia</option>
                                    <option>Germany</option>
                                    <option>France</option>
                                    <option>Japan</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            {addrError && (
                                <p style={{ color: "var(--accent)", fontSize: "13px", marginTop: "0.5rem" }}>
                                    Please fill in all required fields.
                                </p>
                            )}

                            <button className="btn btn-primary" type="submit" disabled={isAddrFormInvalid}>
                                Continue to Payment →
                            </button>
                        </div>
                    </form>
                </div>

                <MiniOrderSummary cart={cart} />
            </div>
            {step === 2 && (
                <div className="checkout-layout">
                    <div>
                        <form noValidate name="payForm">
                            <div className="checkout-section">
                                <div className="checkout-section__title">
                                    <span className="checkout-section__num">2</span>
                                    Payment Details
                                </div>

                                <div className="payment-method">
                                    <button type="button" className={`pay-option ${currPaymentMode === 'card' && 'pay-option--active'}`}
                                        onClick={() => paymentMode('card')} data-method="card">
                                        💳 Card
                                    </button>
                                    <button type="button" className={`pay-option ${currPaymentMode === 'paypal' && 'pay-option--active'}`}
                                        onClick={() => paymentMode('paypal')} data-method="paypal">
                                        🅿 PayPal
                                    </button>
                                    <button type="button" className={`pay-option ${currPaymentMode === 'apple' && 'pay-option--active'}`}
                                        onClick={() => paymentMode('apple')} data-method="apple">
                                        Apple Pay
                                    </button>
                                </div>

                                <div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="card-number">Card Number *</label>
                                        <input className="form-control" type="text" placeholder="1234 5678 9012 3456" maxLength="19" required
                                            value={ccNumber} onChange={(e) => setCcNumber(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="card-name">Cardholder Name *</label>
                                        <input className="form-control" type="text" placeholder="Ada Lovelace" required
                                            value={ccName} onChange={(e) => setCcName(e.target.value)} />
                                    </div>
                                    <div className="form-grid-2">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="card-expiry">Expiry Date *</label>
                                            <input className="form-control" type="text" placeholder="MM / YY" maxLength="7" required
                                                value={ccExp} onChange={(e) => setCcExp(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="card-cvv">CVV *</label>
                                            <input className="form-control" type="text" placeholder="•••" maxLength="4" required
                                                value={ccCVV} onChange={(e) => setCcCVV(e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "none", textAlign: "center", padding: "2rem" }}>
                                    <p style={{ color: "var(--warm-mid)", fontSize: "14px" }}>
                                        You will be redirected to PayPal to complete your payment.
                                    </p>
                                </div>

                                <div style={{ display: "none", textAlign: "center", padding: "2rem" }}>
                                    <p style={{ color: "var(--warm-mid)", fontSize: "14px" }}>
                                        Use Touch ID or Face ID to pay with Apple Pay.
                                    </p>
                                </div>
                                {paymentError && (
                                    <p style={{ color: "var(--accent)", fontSize: "13px", marginTop: "0.5rem" }}>
                                        Please fill in all payment fields.
                                    </p>
                                )}

                                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                                    <button className="btn btn-outline" type="button" onClick={prevStep}>
                                        ← Back
                                    </button>
                                    <button className="btn btn-primary" disabled={isPaymentFormInvalid} onClick={nextStep}>
                                        Place Order →
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <MiniOrderSummary cart={cart} />
                </div>)}

            {step === 3 && (
                <div>
                    <div className="order-success">
                        <div className="order-success__icon">✓</div>
                        <h1 className="order-success__title">Order <em>Confirmed!</em></h1>
                        <p className="order-success__sub">
                            Thank you for your order. We'll send a confirmation to your email
                            address. Your order will ship in 3–5 business days.
                        </p>
                        <div className="order-success__id">
                            {order.id}
                        </div>

                        <div style={{
                            background: "var(--white)",
                            border: "1px solid var(--border)",
                            padding: "1.5rem",
                            textAlign: "left",
                            marginBottom: "2rem",
                            borderRadius: "2px"
                        }}>
                            <div style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: "1.25rem",
                                marginBottom: "1rem",
                                paddingBottom: "0.75rem",
                                borderBottom: "1px solid var(--border)"
                            }}>
                                Order Summary
                            </div>
                            <div className="summary-line" style={{ fontSize: "13px" }}>
                                {order.products.map((item, index) => (
                                    <div key={index}>
                                        <span className="summary-line__label">{item.name} × {item.quantity}</span>
                                        <span>{formatCurrency(item.price)}</span>
                                    </div>
                                ))}
                            </div>
                            {order.discount > 0 && (
                                <div className="summary-line">
                                    <span className="summary-line__label">Discount</span>
                                    <span>{formatCurrency(order.discount)}</span>
                                </div>
                            )}
                            <div className="summary-line">
                                <span className="summary-line__label">Shipping</span>
                                <span>{formatCurrency(order.shippingCost)}</span>
                            </div>
                            <div className="summary-line summary-line--total">
                                <span className="summary-line__label">Total</span>
                                <span style={{ fontFamily: "var(--font-serif)" }}>{formatCurrency(order.total)}</span>
                            </div>
                        </div>

                        <div style={{ color: "var(--warm-mid)", fontSize: "13px", marginBottom: "2rem" }}>
                            Shipped to — —, —, —
                        </div>

                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                            <Link to="/orders" className="btn btn-outline" style={{ padding: "12px 24px" }}>View Orders</Link>
                            <Link to="/catalog" className="btn btn-primary" style={{ padding: "12px 28px" }}>Continue Shopping</Link>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}