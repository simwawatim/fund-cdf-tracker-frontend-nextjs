import axios from "axios";
import BASE_API_URL from "../base/base";


export interface ProjectAPI {
    id: number;
    name: string;
    constituency: number;
    program: number;
    description: string;
    allocated_budget: number;
    status: string;
    start_date: string;
    end_date: string;
    completion_percentage: number;
    beneficiaries_count: number;
    project_manager: string;
    funding_source: string;
    location: string;
    remarks: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;


}


export interface ProjectSuccess {
  status: "success";
  data: ProjectAPI;
}

export interface ProjectError {
  status: "error";
  message: string;
}

export type ProjectResponse = ProjectSuccess | ProjectError;


class ProjectService {
    async createProject ( name: string, description: string, constituency: number, program: number, allocated_budget: number, start_date: string, end_date: string, beneficiaries_count: number, remarks: string ): Promise<ProjectResponse>{
        if(!name || !description || !constituency || !program || !allocated_budget ||start_date || !end_date || !remarks || !beneficiaries_count)
            return { status: "error", message: "All fields are required" };

        try{

            const response = await axios.post<ProjectSuccess>(
                `${BASE_API_URL}api/projects/v1/`,
                {
                   name,
                   description,
                   constituency,
                   program,
                   allocated_budget,
                   start_date,
                   end_date,
                   beneficiaries_count,
                   remarks 
                }
            );
            return response.data

        }catch (err: any) {
            let errorMessage = "Failed to create program";
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
}