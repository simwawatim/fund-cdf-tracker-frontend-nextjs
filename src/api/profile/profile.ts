import axios from "axios";
import BASE_API_URL from "../base/base";
import { getAuthHeader } from "../base/token";
import { handleApiError, APIResponse } from "../../api/base/errorHandler";

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
      const response = await axios.get(`${BASE_API_URL}/api/users/v1/${id}/`, {
        headers: getAuthHeader(),
      });

      if (response.data?.status === "success") {
        return { status: "success", data: response.data.data as ProfileAPI };
      }

      return { status: "error", message: response.data?.message || "Failed to fetch profile" };
    } catch (err: any) {
      const error = handleApiError(err, "Unable to fetch profile.");
      return { status: "error", message: error.message || "Unknown error occurred" };
    }
  }

  async updateProfile(id: number, data: Partial<ProfileAPI>): Promise<MemberResponse> {
    try {
      const response = await axios.patch(
        `${BASE_API_URL}/api/users/update-profile/v1/${id}/`,
        data,
        { headers: getAuthHeader() }
      );

      if (response.data?.status === "success") {
        return { status: "success", data: response.data.data as ProfileAPI };
      }

      return { status: "error", message: response.data?.message || "Failed to update profile" };
    } catch (err: any) {
      const error = handleApiError(err, "Unable to update profile.");
      return { status: "error", message: error.message || "Unknown error occurred" };
    }
  }
}

export default new ProfileService();
