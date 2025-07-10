import { useEffect, useState } from "react";
import { getAllItem } from "../api/product";
import CreateItem from "../components/CreateItem";
import TableItem from "../components/TableItem";
import FilterTasks from "../components/FilterItem";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";

export interface Item {
  id?: string;
  title: string;
  marca: string;
  description: string;
  price: number;
  image1?: any;
  image2?: any;
  image3?: any;
  image_1?: any;
  image_2?: any;
  image_3?: any;
}

export interface UsernameRole {
  username: string | null;
  role: string | null;
}


function CreateProduct() {
  const [send, setSend] = useState<boolean>(false);
  const [data, setData] = useState<Item[]>([]);
  const [form, setForm] = useState<any>({});

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
      setSend(true);
      const resp = await getAllItem(
        `page=${page}&limit=${limit}&${filter}`
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
    <div className="flex flex-col gap-10  min-h-screen w-full p-10 text">


{/* Loader overlay */}
      <AnimatePresence>
        {send && (
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


      <div className=" flex flex-col gap-2">
        <CreateItem form={form} setForm={setForm} setSend={setSend} />
        <FilterTasks setFilter={setFilter} totalItems={totalItems} />
        <TableItem
          data={data}
          send={send}
          setSend={setSend}
          setData={setData}
          setForm={setForm}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default CreateProduct;
