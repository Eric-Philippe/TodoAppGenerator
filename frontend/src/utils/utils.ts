export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const getPublicUrl = () => {
  return API_BASE_URL + "/public/api/v1";
};

export const getPrivateUrl = () => {
  return API_BASE_URL + "/private/api/v1";
};
