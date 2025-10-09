import axios from "axios";
import BASE_API_URL from "../base/base";

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface ProfileAPI {
  id: number;
  user: UserInfo;
  role: string;
  phone: string;
  constituency: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileSuccess {
  status: "success";
  data: ProfileAPI;
}

export interface ProfileError {
  status: "error";
  message: string | Record<string, string[]>;
}

export type MemberResponse = ProfileSuccess | ProfileError;

class ProfileService {
  async getProfileById(id: number): Promise<MemberResponse> {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/users/v1/${id}/`);
      if (response.data?.status === "success") {
        return { status: "success", data: response.data.data as ProfileAPI };
      }
      return { status: "error", message: response.data?.message || "Failed to fetch profile" };
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      return {
        status: "error",
        message: err.response?.data?.message || "Network or server error",
      };
    }
  }

  async updateProfile(id: number, data: Partial<ProfileAPI>): Promise<MemberResponse> {
    try {
      const response = await axios.put(`${BASE_API_URL}/api/users/v1/${id}/`, data);
      if (response.data?.status === "success") {
        return { status: "success", data: response.data.data as ProfileAPI };
      }
      return { status: "error", message: response.data?.message || "Failed to update profile" };
    } catch (err: any) {
      console.error("Error updating profile:", err);
      return {
        status: "error",
        message: err.response?.data?.message || "Network or server error",
      };
    }
  }
}

export default new ProfileService();
