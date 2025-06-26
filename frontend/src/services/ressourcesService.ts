import axios from "axios";
import { getPublicUrl } from "../utils/utils";

export enum Resources {
  DATABASES = "databases",
  BACKEND_ARCHITECTURES = "backend-architectures",
  BACKEND_LANGUAGES = "languages",
  FRONTEND_ARCHITECTURES = "frontend-architectures",
  FRONTEND_FRAMEWORKS = "frontend-frameworks",
  FRONTEND_STYLINGS = "frontend-stylings",
}

export interface ResourceItem {
  id: string;
  name: string;
  description?: string;
  requiredTier: number;
  isActive: boolean;
  createdAt: string;
  code: string;
}

export const getResources = async (
  resource: Resources
): Promise<ResourceItem[]> => {
  const apiUrl = getPublicUrl();
  try {
    const response = await axios.get(`${apiUrl}/${resource}?active=true`);
    return response.data;
  } catch (e) {
    throw new Error(
      `Failed to fetch resources for ${resource}: ${(e as Error).message}`
    );
  }
};
