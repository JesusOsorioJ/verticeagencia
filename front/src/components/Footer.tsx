// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-12 pb-6 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Marca y descripción */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-4">CRUD.</h3>
          <p>
            Vive la experiencia del diseño y la comodidad en cada paso. Tenis seleccionados para tu estilo único.
          </p>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h4 className="text-white font-semibold mb-4">Navegación</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white transition">Inicio</Link></li>
            <li><Link to="/details" className="hover:text-white transition">Detalles</Link></li>
            <li><Link to="/checkout" className="hover:text-white transition">Compra</Link></li>
          </ul>
        </div>

        {/* Contacto / Redes */}
        <div>
          <h4 className="text-white font-semibold mb-4">Síguenos</h4>
          <div className="flex space-x-4 mb-4">
            <a href="#" className="hover:text-white transition">Instagram</a>
            <a href="#" className="hover:text-white transition">Facebook</a>
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">Youtube</a>
          </div>
          <p className="text-sm">contacto@CRUD.com</p>
          <p className="text-sm">+57 301 000 0000</p>
        </div>
      </div>

      {/* Línea final */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} CRUD. Todos los derechos reservados.
      </div>
    </footer>
  );
};
