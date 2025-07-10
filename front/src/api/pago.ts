import axios from "axios";

export const baseURL = import.meta.env.VITE_BACKEND_URL;

interface GetAllItemResponse {
    url: string;
    data: any[];
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

export const createPaymentSession = async (): Promise<GetAllItemResponse | null> => {
  try {
    const response = await authApi.post(`/pagos/create-payment-session`);
    return response.data;
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
};


export const listarTodoslosPagos = async (): Promise<GetAllItemResponse | null> => {
  try {
    const response = await authApi.get(`/pagos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
};


