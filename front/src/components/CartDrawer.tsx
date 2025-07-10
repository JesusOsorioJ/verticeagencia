import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';
import { useFetch } from '../hooks/useFetch';
import { añadirEliminarAlcarro, baseURL, getActiveCart } from '../api/cart';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const [items, setItems] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);

  const { loading, run } = useFetch(async () => {
    const p = await getActiveCart();
    setItems(p?.items);
    calcularTotal(p?.items)
    return;
  });

  function calcularTotal(items:any) {
  const res = items.reduce((sum:any, item:any) => {
    const precio = parseFloat(item.product.price);
    return sum + precio * item.quantity;
  }, 0);
  setTotal(res)
}

  useEffect(() => { run(); }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="text-black fixed top-0 right-0 h-full w-80 bg-white shadow-xl p-6 flex flex-col z-100"
        >
          <button
            onClick={onClose}
            className="self-end text-gray-600 hover:text-gray-900"
            aria-label="Cerrar carrito"
          >
            X
          </button>

          <h3 className="text-2xl font-semibold mb-4">Tu carrito</h3>

          {loading && <div className="flex justify-center">

            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          </div>}
          <div className="flex-1 overflow-y-auto space-y-4">
            {items.length === 0 && (
              <p className="text-gray-500 text-center">No hay productos.</p>
            )}

            {items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={`${baseURL}/uploads/${item.product.image_1.clavePrincipal}.${item.product.image_1.mimetype}`}
                    alt={item.product.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-800 truncate w-32">{item.product.title}</p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                  <button
                    onClick={() => { añadirEliminarAlcarro({ productId: item.productId, quantity: -1 }); run(); }}
                    className="mt-1 text-xs text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <div className="pt-4 border-t w-full">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold">{formatPrice(total)}</span>
              </div>

              <Link
                onClick={onClose}
                to="/checkout"
                className="block w-full py-2 bg-blue-600 text-white hover:bg-blue-800 transition text-center"
              >
                Finalizar Compra
              </Link>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
