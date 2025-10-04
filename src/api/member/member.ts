import axios from "axios";
import BASE_API_URL from "../base/base";
import { stat } from "fs";

export interface CreateMemberPayload {
    user: {
        username: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    role: string;
    phone: string;
    constituency: number;
}
export interface MemberAPI {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    phone: string;
    constituency: number;
}
export interface MemberSuccess {
    status: "success";
    data: MemberAPI;
}

export interface MemberError {
    status: "error";
    message: string | Record<string, string[]>;
}


export type MemberResponse = MemberSuccess | MemberError;

class MemberService {
  async createMember(payload: CreateMemberPayload): Promise<MemberResponse> {
    try {
      const response = await axios.post<MemberResponse>(
        `${BASE_API_URL}/api/users/v1/`,
        payload
      );
      return response.data;
    } catch (err: any) {
      let errorMessage = "Failed to create user";
      const msg = err.response?.data?.message;
      if (msg) {
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

  async getMembers(): Promise<MemberAPI[]> {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/users/v1/`);
      if (response.data.status === "success" && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        console.error("Unexpected response format", response.data);
        return [];
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      return [];
    }
  }

  async updateMember(id: number, payload: Partial<CreateMemberPayload>): Promise<MemberResponse> {
    try {
      const response = await axios.put<MemberResponse>(
        `${BASE_API_URL}/api/users/v1/${id}/`,
        payload
      );
      return response.data;
    } catch (err: any) {
      let errorMessage = "Failed to update user";
      const msg = err.response?.data?.message;
      if (msg) {
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

  async deleteMember(id: number): Promise<MemberResponse> {
    try {
      const response = await axios.delete<MemberResponse>(
        `${BASE_API_URL}/api/users/v1/${id}/`
      );
      return response.data;
    } catch (err: any) {
      let errorMessage = "Failed to delete user";
      const msg = err.response?.data?.message;
      if (msg) {
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
}

export default new MemberService();


