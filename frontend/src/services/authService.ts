import axios from "axios";
import { getPrivateUrl } from "../utils/utils";

export const login = async (email: string, password: string) => {
  const apiUrl = getPrivateUrl();
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      "Erreur lors de la connexion : " + (error as Error).message
    );
  }
};

type AuthCheckRes = {
  hasDefaultPassword: boolean;
  user: {
    token: string;
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    last_connected: string;
    blocked: boolean;
    permissions: number;
  };
  valid: boolean;
};

export const getMyInformations = async (): Promise<AuthCheckRes | object> => {
  const token = localStorage.getItem("token");
  if (!token || token == "") return {};

  const apiUrl = getPrivateUrl();

  try {
    const response = await axios.get(`${apiUrl}/auth/check`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {
    console.error("Erreur lors de la récupération des informations : ", e);
    return {};
  }
};

export const logout = async () => {
  const token = localStorage.getItem("token");
  if (!token || token == "") return {};

  const apiUrl = getPrivateUrl();

  try {
    const response = await axios.post(
      `${apiUrl}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (e) {
    console.error("Erreur lors de la déconnexion : ", e);
    return {};
  }
};
