

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CartDrawer } from './CartDrawer';

const navItems = [
  { to: '/createProduct', label: 'Crear', end: true, disabled: false },
  { to: '/seeProduct', label: 'Ver', end: true, disabled: false },
  { to: '/seeProduct/:id', label: 'Detalle', end: false, disabled: true },
  { to: '/checkout', label: 'Carrito', end: true, disabled: false },
  { to: '/pagos', label: 'Pagos', end: true, disabled: false },

];

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full py-6 absolute top-0 z-10 ">
      <CartDrawer open={open} onClose={() => setOpen(o => !o)} />
      <div className="container mx-auto flex justify-between items-center px-4">
        <NavLink to="/" className="text-2xl font-serif italic">
          CRUD.
        </NavLink>
        <nav className="hidden md:flex space-x-10">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.disabled ? '#' : item.to}
              end={item.end}
              className={({ isActive }) => {
                const active = item.to === '/seeProduct/:id'
                  ? location.pathname.startsWith('/seeProduct/')
                  : isActive;
                return `nav-link hover:text-gray-300 ${active ? 'active text-gray-400' : ''}`;
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex gap-8 items-center">
          <p className='w-24 truncate'>{localStorage.getItem("email")}</p>
          
          <div className="flex items-center cursor-pointer" title='Carrito' onClick={() => setOpen(o => !o)}>
            🛒
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              window.location.href = "/login";
            }}
            title="Logout"
            className="rounded-lg transition-colors uppercase"
          >
            ⏻
          </button>
        </div>

      </div>
    </header>
  );
};
