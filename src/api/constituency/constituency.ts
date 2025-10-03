import axios from "axios";
import BASE_API_URL from "../base/base";

export interface Constituency {
  id: number;
  name: string;
  county: string;
  constituency_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConstituencySuccess {
  status: "success";
  data: Constituency;
}

export interface ConstituencyError {
  status: "error";
  message: string;
}

export type ConstituencyResponse = ConstituencySuccess | ConstituencyError;

class ConstituencyService {
  async createConstituency(name: string, county: string): Promise<ConstituencyResponse> {
    if (!name || !county) {
      return {
        status: "error",
        message: "Name and county are required"
      };
    }

    try {
      const response = await axios.post<ConstituencySuccess>(
        `${BASE_API_URL}api/constituency/v1/`,
        { name, county }
      );
      return response.data;
    } catch (err: any) {
      return {
        status: "error",
        message: err.response?.data?.message || "Failed to create constituency"
      };
    }
  }
}
