import { newItem, updateItem } from "../api/product";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Item } from "../pages/CreateProduct";
import { useEffect } from "react";

interface Props {
  form: Item;
  setForm: (item: Item) => void;
  setSend: (status: boolean) => void;
}

const CreateItem = ({ form, setForm, setSend }: Props) => {
  const { register, handleSubmit, reset } = useForm<Item>({
    defaultValues: form,
  });

useEffect(()=>{reset(form); console.log("safdasd")},[form])

  const onSubmit: SubmitHandler<Item> = async (formData) => {
    try {
      setSend(true);
      let response;

      const payload = {
        title: formData.title,
        marca: formData.marca,
        description: formData.description,
        price: typeof formData.price === "string" ? parseFloat(formData.price) : formData.price,
        // image: formData.image?.[0],
      };

      if (form.id) {
        response = await updateItem(form.id, payload);
      } else {
        response = await newItem(payload);
      }

      if (response && (response.status === 200 || response.status === 201)) {
        reset({});
      } else {
        Swal.fire("Error", "No se pudo completar la acción", "error");
      }
    } catch {
      Swal.fire("Error", "Error en la tarea", "error");
    } finally {
      setForm({} as Item);
      setSend(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center bg-gray-800 w-full p-5 rounded-lg">
      <p className="uppercase">
        {form.id ? `Editar tarea ID: ${form.id}` : "Crear nuevo registro"}
      </p>

      <form
        className="flex w-full gap-4 flex-wrap"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label className="capitalize">Title</label>
          <input
            {...register("title")}
            className="w-full p-3 text-black rounded-lg"
            placeholder="Escribe el título"
          />
        </div>
        <div>
          <label className="capitalize">Marca</label>
          <input
            {...register("marca")}
            className="w-full p-3 text-black rounded-lg"
            placeholder="Escribe marca"
          />
        </div>
        <div>
          <label className="capitalize">Descripción</label>
          <textarea
            required
            {...register("description")}
            className="w-full p-3 text-black rounded-lg"
            placeholder="Escribir mensaje"
          />
        </div>
        <div>
          <label className="capitalize">Precio</label>
          <input
            {...register("price")}
            type="number"
            className="w-full p-3 text-black rounded-lg"
            placeholder="Escribe precio"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setForm({} as Item);
            reset({});
          }}
          className="px-5 bg-gray-950 py-[6px] rounded-lg self-center uppercase"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-5 bg-gray-950 text-white py-[6px] rounded-lg self-center uppercase"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default CreateItem;
