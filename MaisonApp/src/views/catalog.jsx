import "../main.css"
import Productcard from '../component/productcard';
import { useState, useEffect } from 'react';
import { HttpService } from '../services/httpService';
import { CartService } from '../services/cartService';

export default function Catalog() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('default');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        HttpService.getProducts()
            .then(data => {
                setProducts(data);
            })
            .catch(error => {
                console.error('Failed to load products:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const addToCart = async (product) => {
        try {
            await CartService.addToCart(product, 1);
            if (window.showToast) {
                window.showToast(`${product.name} added to cart!`);
            } else {
                alert(`${product.name} added to cart!`);
            }
        } catch (error) {
            console.error('Failed to add to cart:', error);
            if (window.showToast) {
                window.showToast(`Could not add ${product.name} to cart.`, true);
            } else {
                alert(`Could not add ${product.name} to cart.`);
            }
        }
    };

    const addToWishlist = (product) => {
        if (window.showToast) {
            window.showToast(`${product.name} added to wishlist!`);
        } else {
            alert(`${product.name} added to wishlist!`);
        }
    };

    // Derive list of categories dynamically from products
    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    // Filter products based on search term and category
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Sort filtered products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'reviews') return (b.reviews || 0) - (a.reviews || 0);
        return 0; // Default
    });

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <p>Loading curated objects...</p>
            </div>
        );
    }

    return (
        <>
            <div className="page-hero">
                <div className="page-hero__eyebrow">The Full Collection</div>
                <h1 className="page-hero__title">Our <em>Catalog</em></h1>
                <p className="page-hero__sub">
                    {products.length} objects, thoughtfully gathered.
                </p>
            </div>

            <div className="filter-bar">
                <div className="filter-bar__inner" id="filter-bar">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`filter-btn ${selectedCategory === category ? 'filter-btn--active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}

                    <div className="filter-sort">
                        <span>Sort:</span>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="default">Featured</option>
                            <option value="price-asc">Price: Low–High</option>
                            <option value="price-desc">Price: High–Low</option>
                            <option value="rating">Top Rated</option>
                            <option value="reviews">Most Reviewed</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '1.5rem 2.5rem 0' }}>
                <input
                    className="form-control"
                    style={{ maxWidth: '380px' }}
                    type="text"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search objects…"
                />
            </div>

            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem 2.5rem' }}>
                <div className="product-grid product-grid--3" id="catalog-grid">
                    {sortedProducts.map(product => (
                        <Productcard
                            key={product.id}
                            product={product}
                            addToCart={addToCart}
                            addToWishlist={addToWishlist}
                        />
                    ))}

                    {sortedProducts.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-state__glyph">◌</div>
                            <div className="empty-state__title">Nothing found</div>
                            <p className="empty-state__sub">
                                Try a different category or clear your search.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}