import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HttpService } from '../services/httpService';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [randomProduct, setRandomProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        HttpService.getProducts()
            .then(data => {
                setProducts(data);
                if (data.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.length);
                    setRandomProduct(data[randomIndex]);
                }
            })
            .catch(error => {
                console.error('Failed to load products:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <p>Loading curated objects...</p>
            </div>
        );
    }

    return (
        <>
            <section className="hero">
                <div className="hero__left">
                    <div className="hero__text">
                        <div className="hero__eyebrow">Welcome to MAISON</div>
                        <h1 className="hero__title">Objects for the <br /><em>considered</em><br />life.</h1>
                        <p className="hero__sub">
                            Explore our curated collection of hand-crafted items, selected for beauty, utility, and durability.
                        </p>
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <Link to="/catalog" className="btn btn-accent" style={{ padding: "14px 28px", fontSize: "12px" }}>
                                Shop the Catalog
                            </Link>
                        </div>
                    </div>
                </div>

                {randomProduct && (
                    <div className="hero__right">
                        <div className="hero__product-showcase">
                            <Link to={`/product/${randomProduct.id}`}>
                                <div style={{
                                    width: "100%",
                                    aspectRatio: "3/4",
                                    background: "var(--cream2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "8rem",
                                    borderRadius: "2px",
                                    fontFamily: "var(--font-serif)"
                                }}>
                                    {randomProduct.emoji}
                                </div>
                            </Link>
                            <div className="hero__product-badge">
                                <div className="hero__badge-label">Today's Selection</div>
                                <div className="hero__badge-name">{randomProduct.name}</div>
                                <div className="hero__badge-price">${randomProduct.price}</div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}