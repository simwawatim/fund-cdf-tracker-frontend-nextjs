import axios from "axios";
import BASE_API_URL from "../base/base";
import { getAuthHeader } from "../base/token";

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
    if (!name || !district) return { status: "error", message: "Name and district are required" };

    try {
      const response = await axios.post<ConstituencySuccess>(
        `${BASE_API_URL}api/constituencies/v1/`,
        { name, district },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (err: any) {
      let errorMessage = "Failed to create constituency";
      if (err.response?.data?.message) {
        const msg = err.response.data.message;
        if (typeof msg === "string") errorMessage = msg;
        else if (typeof msg === "object") {
          errorMessage = Object.entries(msg)
            .map(([field, errors]) => `${field}: ${(errors as string[]).join(", ")}`)
            .join(" | ");
        }
      }
      return { status: "error", message: errorMessage };
    }
  }

  async updateConstituency(id: number, name: string, district: string): Promise<ConstituencyResponse> {
    if (!id || !name || !district) return { status: "error", message: "ID, name and district are required" };

    try {
      const response = await axios.put<ConstituencySuccess>(
        `${BASE_API_URL}api/constituencies/v1/${id}/`,
        { name, district },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (err: any) {
      let errorMessage = "Failed to update constituency";
      if (err.response?.data?.message) {
        const msg = err.response.data.message;
        if (typeof msg === "string") errorMessage = msg;
        else if (typeof msg === "object") {
          errorMessage = Object.entries(msg)
            .map(([field, errors]) => `${field}: ${(errors as string[]).join(", ")}`)
            .join(" | ");
        }
      }
      return { status: "error", message: errorMessage };
    }
  }

  async getConstituencies(): Promise<ConstituencyAPI[]> {
    try {
      const response = await axios.get(`${BASE_API_URL}api/constituencies/v1/`);
      if (response.data?.status === "success" && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch (err) {
      console.error("Error fetching constituencies:", err);
      return [];
    }
  }


  async deleteConstituency(id: number): Promise<ConstituencyResponse> {
  try {
    const response = await axios.delete(`${BASE_API_URL}api/constituencies/v1/${id}/`,
      {headers: getAuthHeader()}
    );
    return { status: "success", data: response.data };
  } catch (err: any) {
    let errorMessage = "Failed to delete constituency";
    if (err.response?.data?.message) errorMessage = err.response.data.message;
    return { status: "error", message: errorMessage };
  }
}

}

export default new ConstituencyService();
