import axios from "axios";
import BASE_API_URL from "../base/base";

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

export type StatsResponse = StatsSuccess | StatsError;

class StatsService {
  private handleError(err: any, defaultMsg: string): StatsError {
    let errorMessage = defaultMsg;
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

  async getStats(): Promise<StatsResponse> {
    try {
      const response = await axios.get<StatsSuccess>(
        `${BASE_API_URL}api/dashboard-summary/`
      );
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to get stats");
    }
  }
}

export default new StatsService();
