import axios from "axios";
import BASE_API_URL from "../base/base";

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
export interface UserProfileAPI {
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
}

export interface MemberAPI {
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

export interface MemberResponse {
  status: "success" | "error";
  data?: MemberAPI;
  message?: string | Record<string, string[]>;
}

class MemberService {
  // Create a member
  async createMember(payload: CreateMemberPayload): Promise<MemberResponse> {
    try {
      const response = await axios.post<MemberResponse>(
        `${BASE_API_URL}/api/users/v1/`,
        payload
      );
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to create user");
    }
  }

  // Get all members
  async getMembers(): Promise<MemberAPI[]> {
    try {
      const response = await axios.get<MemberResponse>(`${BASE_API_URL}/api/users/v1/`);
      if (response.data.status === "success" && response.data.data) {
        return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      } else {
        console.error("Unexpected response format", response.data);
        return [];
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      return [];
    }
  }

  // Get member by ID
  async getMemberById(id: number): Promise<MemberResponse> {
    try {
      const response = await axios.get<MemberResponse>(`${BASE_API_URL}/api/users/v1/${id}/`);
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to fetch user");
    }
  }

  // Get currently logged-in member
  async getCurrentMember(): Promise<MemberResponse> {
    try {
      const response = await axios.get<MemberResponse>(`${BASE_API_URL}/api/users/v1/current/`);
      if (response.data.status === "success" && response.data.data) {
        return response.data;
      } else {
        return { status: "error", message: "No current user found" };
      }
    } catch (err: any) {
      return this.handleError(err, "Failed to fetch current user");
    }
  }

  // Update member
  async updateMember(id: number, payload: Partial<CreateMemberPayload>): Promise<MemberResponse> {
    try {
      const response = await axios.put<MemberResponse>(
        `${BASE_API_URL}/api/users/v1/${id}/`,
        payload
      );
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to update user");
    }
  }

  // Delete member
  async deleteMember(id: number): Promise<MemberResponse> {
    try {
      const response = await axios.delete<MemberResponse>(`${BASE_API_URL}/api/users/v1/${id}/`);
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to delete user");
    }
  }

  // Helper to handle errors
  private handleError(err: any, defaultMsg: string): MemberResponse {
    let errorMessage = defaultMsg;
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

export default new MemberService();
