import "./config/i18n";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import { ProductPage } from "./pages/ProductPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import CreateProduct from "./pages/CreateProduct";
import SeeProducts from "./pages/SeeProducts";
import { PagosPage } from "./pages/Pagos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/createProduct" element={<Layout><CreateProduct /></Layout>} />
        <Route path="/seeProduct" element={<Layout><SeeProducts /></Layout>} />
        <Route path="/seeProduct/:id" element={<Layout><ProductPage /></Layout>} />
        <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
        <Route path="/pagos" element={<Layout><PagosPage /></Layout>} />
        {/* Ruta comodín: redirige todo lo demás a /createProduct */}
        <Route path="*" element={<Navigate to="/createProduct" replace />}/>
      </Routes>
    </Router>
  );
}

export default App;
