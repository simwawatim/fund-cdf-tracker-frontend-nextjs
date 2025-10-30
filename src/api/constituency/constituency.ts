import axios from "axios";
import BASE_API_URL from "../base/base";
import { getAuthHeader } from "../base/token";
import { handleApiError } from "../base/errorHandler";

export interface ConstituencyAPI {
  id: number;
  name: string;
  district: string;
  constituency_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConstituencySuccess {
  status: "success";
  data: ConstituencyAPI;
}

export interface ConstituencyError {
  status: "error";
  message: string;
}

export type ConstituencyResponse = ConstituencySuccess | ConstituencyError;

class ConstituencyService {
  async createConstituency(name: string, district: string): Promise<ConstituencyResponse> {
    if (!name || !district) {
      return { status: "error", message: "Name and district are required" };
    }

    try {
      const response = await axios.post(`${BASE_API_URL}api/constituencies/v1/`,
        { name, district },
        { headers: getAuthHeader() }
      );

      if (response.data?.status === "success") {
        return { status: "success", data: response.data.data };
      }

      return { status: "error", message: response.data?.message || "Failed to create constituency" };
    } catch (err: any) {
      const error = handleApiError(err, "Failed to create constituency.");
      return { status: "error", message: error.message || "An error occurred" };
    }
  }

  async updateConstituency(id: number, name: string, district: string): Promise<ConstituencyResponse> {
    if (!id || !name || !district) {
      return { status: "error", message: "ID, name and district are required" };
    }

    try {
      const response = await axios.put(`${BASE_API_URL}api/constituencies/v1/${id}/`,
        { name, district },
        { headers: getAuthHeader() }
      );

      if (response.data?.status === "success") {
        return { status: "success", data: response.data.data };
      }

      return { status: "error", message: response.data?.message || "Failed to update constituency" };
    } catch (err: any) {
      const error = handleApiError(err, "Failed to update constituency.");
      return { status: "error", message: error.message || "An error occurred" };
    }
  }

  async getConstituencies(): Promise<ConstituencyAPI[]> {
    try {
      const response = await axios.get(`${BASE_API_URL}api/constituencies/v1/`, {
        headers: getAuthHeader(),
      });

      if (response.data?.status === "success" && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      return [];
    } catch (err: any) {
      const error = handleApiError(err, "Failed to fetch constituencies.");
      console.error("Error fetching constituencies:", error.message);
      return [];
    }
  }

  async deleteConstituency(id: number): Promise<ConstituencyResponse> {
    try {
      const response = await axios.delete(`${BASE_API_URL}api/constituencies/v1/${id}/`, {
        headers: getAuthHeader(),
      });

      if (response.data?.status === "success") {
        return { status: "success", data: response.data.data };
      }

      return { status: "error", message: response.data?.message || "Failed to delete constituency" };
    } catch (err: any) {
      const error = handleApiError(err, "Failed to delete constituency.");
      return { status: "error", message: error.message || "An error occurred" };
    }
  }
}

export default new ConstituencyService();
