import axios, { AxiosResponse } from "axios";

interface UserCredentials {
  email?: string;
  identifier?: string;
  password: string;
}

interface AuthResponse {
  email: string;
  access_token: string;
  refresh_token: string;
}

// Establecer la URL base para las solicitudes
const baseURL = import.meta.env.VITE_BACKEND_URL;

// Registro de usuario
export const registerUser = async (body: UserCredentials): Promise<AxiosResponse<AuthResponse> | null> => {
  try {
    const response = await axios.post(`${baseURL}/users`, body);
    return response;
  } catch (error) {
    console.error("Error en el registro:", error);
    return null;
  }
};

// Login de usuario
export const loginUser = async (body: UserCredentials): Promise<AxiosResponse<AuthResponse> | null> => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, body);
    return response;
  } catch (error) {
    console.error("Error en el login:", error);
    return null;
  }
};
