"use client";
import { useForm, SubmitHandler } from "react-hook-form";
interface FormData {
  title?: string;
  marca?: string;
  sortBy?: string;
  order?: string;
}
interface FilterTasksProps {
  setFilter: (filter: string) => void;
  totalItems: number;
}

export default function FilterTasks({
  setFilter,
  totalItems,
}: FilterTasksProps) {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    let result = Object.entries(formData)
      .filter(([, value]) => value !== "")
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    result = result.trim() !== "" ? result.replace("+", "\\%2B") : result;
    setFilter(result);
  };

  return (
    <div className="flex flex-col gap-2 bg-gray-800  rounded-md px-[30px] py-[20px]">
      <p className="text-center w-full uppercase">
        Filtro: Total de items {totalItems}
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-fit w-full items-center gap-[20px] flex-wrap"
      >
        <div>
          <p className="capitalize">Titulo</p>
          <input
            {...register("title")}
            placeholder="--"
            className="text-black w-full rounded-md p-3 focus:outline-none"
          />
        </div>
        <div>
          <p className="capitalize">Marca</p>
          <input
            {...register("marca")}
            placeholder="--"

            className="text-black w-full rounded-md p-3 focus:outline-none"
          />
        </div>

        <div>
          <p className="capitalize">Ordenar por</p>
          <select
            {...register("sortBy")}
            defaultValue="title"
            className="w-full rounded-md p-3  focus:outline-none text-black"
          >
            <option value="">---</option>
            <option value="title">title</option>
            <option value="marca">marca</option>
            <option value="price">price</option>
          </select>
        </div>
        <div>
          <p className="capitalize">Orden</p>
          <select
            {...register("order")}
            defaultValue="ASC"
            className="w-full rounded-md p-3  focus:outline-none text-black"
          >
            <option value="">---</option>
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </select>
        </div>

        
        <div className="flex flex-col items-center justify-between gap-[10px] pt-[20px] sm:flex-row">
          <button
            type="button"
            onClick={() => location.reload()}
            className="w-full uppercase bg-gray-950 rounded-lg px-[20px] py-[10px] sm:w-fit"
          >
            Restablecer
          </button>
          <button className="w-full uppercase rounded-lg bg-gray-950 px-[20px] py-[10px] sm:w-fit">
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
}
