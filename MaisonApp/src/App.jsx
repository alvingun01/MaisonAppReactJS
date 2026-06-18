import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './views/home';
import Navbar from './component/navbar';
import Footer from './component/footer';
import Catalog from './views/catalog';
import Login from './views/login';
const About = () => <h2>About Us</h2>;

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}