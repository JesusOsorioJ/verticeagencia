

import React, { useEffect, useState } from 'react';
import { formatPrice } from '../utils/format';
import { useFetch } from '../hooks/useFetch';
import { listarTodoslosPagos } from '../api/pago';
import { Loading } from './ProductPage';

export const PagosPage: React.FC = () => {
  const [items, setItems] = useState<any>([]);
 
  const { loading, run } = useFetch(async () => {
      const p = await listarTodoslosPagos();
      setItems(p?.data);
      return;
    });
  
  useEffect(() => { run(); }, [open]);

  if (loading) return ( <Loading />);

  return (
    <div className=" flex flex-col  px-10 min-h-[60vh]">
      
      <main className="container mx-auto p-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Procesos de Pagos Stripe</h1>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No hay Procesos de Pagos</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item:any) => (
              <div key={item.id} className="flex items-center justify-between bg-white shadow p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium text-gray-800">CarritoID: {item.carritoId}</p>
                    <p className="text-sm text-gray-500">Fecha: {item.createdAt}</p>
                    <p className="text-sm text-gray-500">Payment amount: {formatPrice(item.paymentAmount)}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-800">{item.paymentStatus}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
