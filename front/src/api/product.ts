import axios, { AxiosResponse } from "axios";
import { Item } from "../pages/CreateProduct";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export interface Message {
  sender: string;
  content: string;
  createdAt: number;
}

interface GetAllItemResponse {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  data: Item[];
}

// Interceptor de solicitudes para agregar el token
export const authApi = axios.create({
  baseURL,
});

authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      window.location.href = "/login";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas para manejar errores 401
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getAllItem = async (
  query: string = ""
): Promise<GetAllItemResponse | null> => {
  try {
    const response = await authApi.get(`/productos?relations=true&${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
};

// Función para crear un nuevo item
export const newItem = async (
  body: Item
): Promise<AxiosResponse<Item> | null> => {
  try {
    const response: AxiosResponse<Item> = await authApi.post(`/productos`, body);


    return response;
  } catch (error) {
    console.error("Error sending item:", error);
    return null;
  }
};

// Función para actualizar un item
export const updateItem = async (
  id: string,
  body: Item
): Promise<AxiosResponse<Item> | null> => {
  try {
    const response: AxiosResponse<Item> = await authApi.patch(`/productos/${id}`, body);
    return response;
  } catch (error) {
    console.error("Error sending item", error);
    return null;
  }
};

// Función para eliminar un item
export const deleteItem = async (
  id: string
): Promise<AxiosResponse<void> | null> => {
  try {
    const response = await authApi.delete(`/productos/hardDelete/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting item", error);
    return null;
  }
};


// Función para eliminar un item
export const uploadImageItem = async ({
  id,
  field,
  data
}: {
  id: string 
  field: string,
  data: any
}): Promise<AxiosResponse<void> | null> => {
  try {
    const response: AxiosResponse<void> = await authApi.patch(`/productos/uploadFile/${field}/${id}`,
      data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting item", error);
    return null;
  }
};

