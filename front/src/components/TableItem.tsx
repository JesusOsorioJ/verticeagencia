import { deleteItem, getAllItem } from "../api/product";
import Swal from "sweetalert2";
import Paginator from "./Paginator";
import { Dispatch, SetStateAction } from "react";
import { Item } from "../pages/CreateProduct";
import { uploadImageItem } from "../api/product";

interface TableProps {
  data: Item[];
  send: boolean;
  setSend: (status: boolean) => void;
  setData: (items: Item[]) => void;
  setForm: (item: Item) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const baseURL = import.meta.env.VITE_BACKEND_URL;

function TableItem({
  data,
  send,
  setSend,
  setData,
  setForm,
  currentPage,
  totalPages,
  setCurrentPage,
}: TableProps) {

  const handleDelete = async (id?: string) => {
    if (!id) return;

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText:  "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setSend(true);
    try {
      await deleteItem(id);
      const res = await getAllItem();
      if (res?.data && Array.isArray(res.data)) {
        setData(res.data);
      }
      Swal.fire("Eliminado", "Elemento eliminado con éxito", "success");
    } catch {
      Swal.fire("Error", "Error deleting task", "error");
    } finally {
      setSend(false);
    }
  };

  const uploadImageHandler = async ({ image, e, d }: { image: any, e: any, d: any }) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmar = window.confirm("¿Estás seguro de que deseas subir esta imagen?");
    if (!confirmar) {
      e.target.value = "";
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("field", image);
    data.append("id", d.id ?? "");

    await uploadImageItem({ id: d.id ?? "", data, field: image });
  }

  return (
    <div className="flex flex-col gap-2 items-center bg-gray-800 w-full p-5 rounded-lg">
      <p className="uppercase">Tabla de registro</p>
      <table className="w-full p-3 rounded-lg text-center table-fixed">
        <thead>
          <tr className="uppercase">
            <th scope="col">ID</th>
            <th scope="col">Title</th>
            <th scope="col">Price</th>
            <th scope="col">Image1</th>
            <th scope="col">Image2</th>
            <th scope="col">Image3</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id}>
              <td className="truncate">{d.id}</td>
              <td>{d.title}</td>
              <td>{d.price}</td>
              <td>
                {d.image_1 && (
                  <img
                    src={`${baseURL}/uploads/${d.image_1?.clavePrincipal}.${d.image_1?.mimetype}`}
                    alt="task-img"
                    className="size-[50px] object-cover rounded"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => await uploadImageHandler({ image: "image1", e, d })}
                  className="w-[150px] p-3 bg-gray-300 rounded-lg"
                />
              </td>
              <td>
                {d.image_2 && (
                  <img
                    src={`${baseURL}/uploads/${d.image_2?.clavePrincipal}.${d.image_2?.mimetype}`}
                    alt="task-img"
                    className="size-[50px] object-cover rounded"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => await uploadImageHandler({ image: "image2", e, d })}
                  className="w-[150px] p-3 bg-gray-300 rounded-lg"
                />
              </td>
              <td>
                {d.image_3 && (
                  <img
                    src={`${baseURL}/uploads/${d.image_3?.clavePrincipal}.${d.image_3?.mimetype}`}
                    alt="task-img"
                    className="size-[50px] object-cover rounded"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => await uploadImageHandler({ image: "image3", e, d })}
                  className="w-[150px] p-3 bg-gray-300 rounded-lg"
                />
              </td>

              <td className="flex gap-2 justify-center py-2  w-full">
                <button
                  onClick={() => handleDelete(d.id)}
                  className="text-red-600 hover:text-red-800 text-xl"
                  title="Eliminar"
                >
                  🗑️
                </button>
                <button
                  onClick={() => setForm(d)}
                  className="text-blue-600 hover:text-blue-800 text-xl"
                  title="Editar"
                >
                  ✏️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && !send && (
        <p className="text-center">Nada que mostrar</p>
      )}

      {send && (
        <div className="flex gap-2 bg-gray-300 p-4 rounded animate-pulse">
          <div className="h-2 w-2 rounded-full bg-black" />
          <div className="h-2 w-2 rounded-full bg-black" />
          <div className="h-2 w-2 rounded-full bg-black" />
        </div>
      )}
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default TableItem;
