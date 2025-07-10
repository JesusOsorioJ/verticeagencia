import { formatPrice } from '../utils/format';
const baseURL = import.meta.env.VITE_BACKEND_URL;

export const ProductCard = ({
  id,
  title,
  price,
  image_1,
}:
{
  id?:any,
  title:any,
  price:any,
  image_1?:any,
}
) => {
  return (
    <a href={`/seeProduct/${id}`} className="relative bg-[#00000042] overflow-hidden shadow-md group transition-transform duration-300 hover:scale-[1.015] w-fit">
      <img
        src={`${baseURL}/uploads/${image_1.clavePrincipal}.${image_1.mimetype}`}
        alt={title + id}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="p-4">
        <h3 className="text-white text-base font-medium line-clamp-2">{title}</h3>

        <div className="mt-2">
          <span className="text-white text-base font-bold">{formatPrice(price)}</span>
        </div>
      </div>

      <div

        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition duration-300 bg-white text-black text-sm px-4 py-1.5 shadow hover:bg-gray-200"
      >
        Ver más
      </div>
    </a>
  );
};
