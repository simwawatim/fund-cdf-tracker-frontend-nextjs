import axios from "axios";
import BASE_API_URL from "../base/base";
import { getAuthHeader } from "../base/token";
import { handleApiError, APIResponse } from "../../api/base/errorHandler";

export interface CreateMemberPayload {
  user: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  role: string;
  phone: string;
  constituency: number | null;
}

export interface MemberAPI {
  profile_picture: string;
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  role: string;
  phone: string;
  constituency: number | null;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MemberResponse extends APIResponse {
  data?: MemberAPI;
}

class MemberService {
  async createMember(payload: CreateMemberPayload): Promise<MemberResponse> {
    try {
      const response = await axios.post<MemberResponse>(
        `${BASE_API_URL}/api/users/v1/`,
        payload,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (err: any) {
      return handleApiError(err, "Failed to create user");
    }
  }

  async getMembers(): Promise<MemberAPI[]> {
    try {
      const response = await axios.get<MemberResponse>(`${BASE_API_URL}/api/users/v1/`, {
        headers: getAuthHeader(),
      });
      if (response.data.status === "success" && response.data.data) {
        return Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];
      }
      return [];
    } catch (err: any) {
      handleApiError(err, "Failed to fetch members");
      return [];
    }
  }

  async getMemberById(id: number): Promise<MemberResponse> {
    try {
      const response = await axios.get<MemberResponse>(
        `${BASE_API_URL}/api/users/v1/${id}/`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (err: any) {
      return handleApiError(err, "Failed to fetch user");
    }
  }

  async getCurrentMember(): Promise<MemberResponse> {
    try {
      const response = await axios.get<MemberResponse>(
        `${BASE_API_URL}/api/users/v1/current/`,
        { headers: getAuthHeader() }
      );
      if (response.data.status === "success" && response.data.data) {
        return response.data;
      }
      return { status: "error", message: "No current user found" };
    } catch (err: any) {
      return handleApiError(err, "Failed to fetch current user");
    }
  }

  async updateMember(id: number, payload: Partial<CreateMemberPayload>): Promise<MemberResponse> {
    try {
      const response = await axios.put<MemberResponse>(
        `${BASE_API_URL}/api/users/v1/${id}/`,
        payload,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (err: any) {
      return handleApiError(err, "Failed to update user");
    }
  }

  async deleteMember(id: number): Promise<MemberResponse> {
    try {
      const response = await axios.delete<MemberResponse>(
        `${BASE_API_URL}/api/users/v1/${id}/`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (err: any) {
      return handleApiError(err, "Failed to delete user");
    }
  }
}

export default new MemberService();
