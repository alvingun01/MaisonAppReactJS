import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './views/home';
import Navbar from './component/navbar';
import Footer from './component/footer';
import Catalog from './views/catalog';
import Login from './views/login';
import Cart from './views/cart';
import ProductDetails from './views/productDetails';
import Register from './views/register';
import Checkout from './views/checkout';
import Order from './views/order';
import { CartProvider } from './hooks/useCart';
import Wishlist from './views/wishlist';
import { WishlistProvider } from './hooks/useWishlist';

const About = () => <h2>About Us</h2>;

export default function App() {
  return (
    <BrowserRouter>
      <WishlistProvider>
        <CartProvider>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Order />} />
              <Route path='/wishlist' element={<Wishlist />} />
            </Routes>
          </main>
          <Footer />
        </CartProvider>
      </WishlistProvider>
    </BrowserRouter>
  );
}