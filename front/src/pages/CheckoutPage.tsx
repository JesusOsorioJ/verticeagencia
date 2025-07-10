import React, { useEffect, useState } from 'react';
import { formatPrice } from '../utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import { baseURL, getActiveCart } from '../api/cart';
import { useFetch } from '../hooks/useFetch';
import { createPaymentSession } from '../api/pago';
import { Loading } from './ProductPage';

export const CheckoutPage: React.FC = () => {
  const [items, setItems] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [processing, setProcessing] = useState(false);
 
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


 const handleConfirm = async () => {
    setProcessing(true);
    try {
      const data = await createPaymentSession(); 
      if (data?.url) {
        // Redirige al usuario a la URL del checkout
        window.location.href = data.url;
      } else {
        console.error('No se recibió URL de pago');
        setProcessing(false);
      }
    } catch (err) {
      console.error('Error al crear la sesión de pago', err);
      setProcessing(false);
    }
  };


  if (loading) return ( <Loading />);

  return (
    <div className=" flex flex-col px-10 min-h-[60vh]">
      
      <main className="container mx-auto p-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Proceso de Pago</h1>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No hay productos en el carrito.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item:any) => (
              <div key={item.id} className="flex items-center justify-between bg-white shadow p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img src={`${baseURL}/uploads/${item.product.image_1.clavePrincipal}.${item.product.image_1.mimetype}`}
                                      alt={item.product.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <p className="font-medium text-gray-800 truncate w-48">{item.product.title}</p>
                    <p className="text-sm text-gray-500">Marca: {item.product.marca}</p>
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-800">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-4 flex justify-between text-lg font-bold">
              <span>Total a pagar:</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              onClick={handleConfirm}
              disabled={processing}
              className="mt-6 w-full py-3 bg-green-600 text-white hover:bg-green-700 transition shadow-lg text-center font-semibold disabled:opacity-50"
            >
              {processing ? 'Procesando pago...' : 'Confirmar Pago'}
            </button>
          </div>
        )}
      </main>

      {/* Loader overlay */}
      <AnimatePresence>
        {processing && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-20 h-20 border-4 border-t-4 border-gray-200 border-t-green-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

