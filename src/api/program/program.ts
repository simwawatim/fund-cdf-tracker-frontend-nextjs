import axios from "axios";
import BASE_API_URL from "../base/base";
import { getAuthHeader } from "../base/token";
import { handleApiError } from "../base/errorHandler";

export interface ProgramAPI {
  id: number;
  name: string;
  description: string;
}

export interface ProgramSuccess {
  status: "success";
  data: ProgramAPI | ProgramAPI[]; 
}

export interface ProgramError {
  status: "error";
  message: string;
}

export type ProgramResponse = ProgramSuccess | ProgramError;

class ProgramService {
  // --------------------
  // Create a new program
  // --------------------
  async createProgram(name: string, description: string): Promise<ProgramResponse> {
    if (!name || !description) {
      return { status: "error", message: "Name and description are required" };
    }

    try {
      const response = await axios.post(`${BASE_API_URL}api/programs/v1`, 
        { name, description }, 
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (err: any) {
      const error = handleApiError(err, "Failed to create program.");
      return { status: "error", message: error.message || "An error occurred" };
    }
  }

  // --------------------
  // Get all programs
  // --------------------
  async getPrograms(): Promise<ProgramResponse> {
    try {
      const response = await axios.get(`${BASE_API_URL}api/programs/v1`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (err: any) {
      const error = handleApiError(err, "Failed to retrieve programs.");
      return { status: "error", message: error.message || "An error occurred" };
    }
  }

  // --------------------
  // Get a single program
  // --------------------
  async getProgramById(id: number): Promise<ProgramResponse> {
    try {
      const response = await axios.get(`${BASE_API_URL}api/programs/v1/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (err: any) {
      const error = handleApiError(err, "Failed to retrieve program.");
      return { status: "error", message: error.message || "An error occurred" };
    }
  }

  // --------------------
  // Update a program
  // --------------------
  async updateProgram(id: number, name: string, description: string): Promise<ProgramResponse> {
    if (!id) return { status: "error", message: "Program ID is required" };

    try {
      const response = await axios.put(`${BASE_API_URL}api/programs/v1/${id}`, 
        { name, description }, 
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (err: any) {
      const error = handleApiError(err, "Failed to update program.");
      return { status: "error", message: error.message || "An error occurred" };
    }
  }

  // --------------------
  // Delete a program
  // --------------------
  async deleteProgram(id: number): Promise<ProgramResponse> {
    if (!id) return { status: "error", message: "Program ID is required" };

    try {
      const response = await axios.delete(`${BASE_API_URL}api/programs/v1/${id}`, {
        headers: getAuthHeader(),
      });
      return { status: "success", data: response.data }; 
    } catch (err: any) {
      const error = handleApiError(err, "Failed to delete program.");
      return { status: "error", message: error.message || "An error occurred" };
    }
  }
}

export default new ProgramService();
