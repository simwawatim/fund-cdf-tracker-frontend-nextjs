import axios from "axios";
import BASE_API_URL from "../base/base";

export interface ProgramAPI {
  id: number;
  name: string;
  description: string;
}

export interface ProgramSuccess {
  status: "success";
  data: ProgramAPI | ProgramAPI[]; // Single or multiple
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
      const response = await axios.post<ProgramSuccess>(
        `${BASE_API_URL}api/programs/v1`,
        { name, description }
      );
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to create program.");
    }
  }

  // --------------------
  // Get all programs
  // --------------------
  async getPrograms(): Promise<ProgramResponse> {
    try {
      const response = await axios.get<ProgramSuccess>(
        `${BASE_API_URL}api/programs/v1`
      );
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to retrieve programs.");
    }
  }

  // --------------------
  // Get a single program
  // --------------------
  async getProgramById(id: number): Promise<ProgramResponse> {
    try {
      const response = await axios.get<ProgramSuccess>(
        `${BASE_API_URL}api/programs/v1/${id}`
      );
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to retrieve program.");
    }
  }

  // --------------------
  // Update a program
  // --------------------
  async updateProgram(id: number, name: string, description: string): Promise<ProgramResponse> {
    if (!id) {
      return { status: "error", message: "Program ID is required" };
    }

    try {
      const response = await axios.put<ProgramSuccess>(
        `${BASE_API_URL}api/programs/v1/${id}`,
        { name, description }
      );
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to update program.");
    }
  }

  // --------------------
  // Delete a program
  // --------------------
  async deleteProgram(id: number): Promise<ProgramResponse> {
    if (!id) {
      return { status: "error", message: "Program ID is required" };
    }

    try {
      const response = await axios.delete<ProgramSuccess>(
        `${BASE_API_URL}api/programs/v1/${id}`
      );
      return {
        status: "success",
        data: { id, name: "", description: "" } // Just returning placeholder info
      };
    } catch (err: any) {
      return this.handleError(err, "Failed to delete program.");
    }
  }

  // --------------------
  // Helper: Handle API errors
  // --------------------
  private handleError(err: any, defaultMsg: string): ProgramError {
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
}

export default new ProgramService();
