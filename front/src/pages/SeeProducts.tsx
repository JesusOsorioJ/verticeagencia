import { useEffect, useState } from "react";
import { getAllItem } from "../api/product";
import FilterTasks from "../components/FilterItem";
import Swal from "sweetalert2";
import { ProductCard } from "../components/ProductCard";
import Paginator from "../components/Paginator";
import { Loading } from "./ProductPage";

export interface Item {
  id?: string;
  title: string;
  marca: string;
  description: string;
  price: number;
  image1?: any;
  image2?: any;
  image3?: any;
}

export interface UsernameRole {
  username: string | null;
  role: string | null;
}


function SeeProducts() {
  const [send, setSend] = useState<boolean>(false);
  const [data, setData] = useState<Item[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const limit = 3;

  useEffect(() => {
    filterPurchases(1);
  }, [filter]);

  useEffect(() => {
    filterPurchases(currentPage);
  }, [currentPage]);



  const filterPurchases = async (page: number): Promise<void> => {
    try {
      const resp = await getAllItem(
        `page=${page}&limit=${limit}&purchaseView=true&${filter}`
      );
      if (resp) {
        setTotalItems(resp.totalItems);
        setTotalPages(resp.totalPages);
        setData(resp.data);
      }
    } catch {
      Swal.fire("Error al obtener los elementos");
    } finally {
      setSend(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 min-h-screen w-full p-10 text">
      <div className=" flex flex-col gap-2">
        {send && <Loading /> }
        <FilterTasks setFilter={setFilter} totalItems={totalItems} />
        <div className="flex gap-1 flex-wrap">
          {data.map(d=> (
            <ProductCard  {...d} />
          ))}
        </div>
        <Paginator totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      </div>
    </div>
  );
}

export default SeeProducts;
