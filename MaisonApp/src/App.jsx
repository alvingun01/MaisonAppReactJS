import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './views/home';
import Navbar from './component/navbar';
import Footer from './component/footer';
const About = () => <h2>About Us</h2>;

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}