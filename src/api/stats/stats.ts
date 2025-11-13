import axios from "axios";
import BASE_API_URL from "../base/base";
import { getAuthHeader } from "../base/token"; 
import { handleApiError, APIResponse } from "../../api/base/errorHandler";

export interface Stats {
  total_users: number;
  total_constituencies: number;
  total_programs: number;
  pending_projects: number;
  active_projects: number;
}

export interface StatsSuccess {
  status: "success";
  data: Stats[];
}

export interface StatsError {
  status: "error";
  message: string;
}

export interface StatItem {
  name: string;
  Users: number;
  Projects: number;
}

export interface StatsCardResponse {
  status: string;
  data: StatItem[];
}

export type StatsResponse = StatsSuccess | StatsError;

class StatsService {
  private handleError(err: any, defaultMsg: string): StatsError {
    // Handle 401 here
    if (err.response?.status === 401) {
      window.location.href = "/";
    }

    let errorMessage = defaultMsg;

    if (err.response?.data?.message) {
      const msg = err.response.data.message;

      if (typeof msg === "string") {
        errorMessage = msg;
      } else if (typeof msg === "object") {
        errorMessage = Object.entries(msg)
          .map(([field, errors]) => `${field}: ${(errors as string[]).join(", ")}`)
          .join(" | ");
      }
    }

    return { status: "error", message: errorMessage };
  }

  async getStats(): Promise<StatsResponse> {
    try {
      const response = await axios.get<StatsSuccess>(
        `${BASE_API_URL}api/dashboard-summary/`,
        { headers: getAuthHeader() }
      );

      return response.data;

    } catch (err: any) {
      return this.handleError(err, "Failed to get stats");
    }
  }

  async getStatsGraph(): Promise<StatsCardResponse> {
    try {
      const response = await axios.get<StatsCardResponse>(
        `${BASE_API_URL}api/stats/`,
        { headers: getAuthHeader() }
      );

      return response.data;

    } catch (err: any) {
      if (err.response?.status === 401) {
        window.location.href = "/";
      }

      console.error("Error fetching stats:", err);
      throw err;
    }
  }
}

export default new StatsService();
