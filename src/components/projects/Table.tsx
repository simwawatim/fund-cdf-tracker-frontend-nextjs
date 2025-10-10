"use client";

import { useEffect, useState } from "react";
import ConstituencyService from "../../api/constituency/constituency";
import ProgramService, { ProgramAPI } from "../../api/program/program";
import ProjectService, {ProjectAPI } from "../../api/project/project"
import Swal from "sweetalert2";
import Link from "next/link";


interface Project {
  id: number
  name: string;
  constituency: number;
  program: number;
  description: string;
  allocated_budget: number;
  status: string;
  start_date: string;
  end_date: string;
  beneficiaries_count: number;
  project_manager: string;
  funding_source: string;
  location: string;
  remarks: string;
}

interface Constituency {
  id: number;
  name: string;
}

const ProjectsTable = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [programType, setProgramTypes] = useState<ProgramAPI[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const [formData, setFormData] = useState<Project>({
    id: 0,
    name: "",
    constituency: 0,
    program: 0,
    description: "",
    allocated_budget: 0,
    status: "",
    start_date: "",
    end_date: "",
    beneficiaries_count: 0,
    project_manager: "",
    funding_source: "",
    location: "",
    remarks: "",
  })

  const handleGetConstituencies = async () =>{
    try{
      const response = await ConstituencyService.getConstituencies();
      setConstituencies(response);
    }

    catch(error){
        console.error("Error fetching constituencies:", error);
        Swal.fire("Error", "Failed to fetch constituencies", "error");
    }
  }

  const handleGetProjects = async () =>{
    const response = await ProjectService.getProjects();
    if (response.status === "success"){
      setProjects(Array.isArray(response.data) ? response.data as Project[] : [response.data as Project])
    }else{
      Swal.fire("Error", response.message, "error");
    }
  }

  const handleGetPrograms = async () => {
    try{
      const response = await ProgramService.getPrograms();
      if (response.status === "success"){
        setProgramTypes(response.data as ProgramAPI[]);

      }else{
        Swal.fire("Error", response.message, "error");
      }
    }

    catch(error){
        console.error("Error fetching programs:", error);
        Swal.fire("Error", "Failed to fetch programs", "error");
    }

  }


  useEffect(() => {
    handleGetConstituencies();
    handleGetPrograms();
    handleGetProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      id: 0,
      name: "",
      constituency: 0,
      program: 0,
      description: "",
      allocated_budget: 0,
      status: "",
      start_date: "",
      end_date: "",
      beneficiaries_count: 0,
      project_manager: "",
      funding_source: "",
      location: "",
      remarks: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({ ...project });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    try {
      if (editingProject) {
      setProjects(projects.map((p) => (p === editingProject ? formData : p)));
      } 
      
      else {
        setProjects([...projects, formData]);
        console.log(formData)
        const response = await ProjectService.createProject(
          
          formData.name,
          formData.description,
          formData.constituency,
          formData.program, 
          formData.allocated_budget,
          formData.start_date,
          formData.end_date,
          formData.beneficiaries_count,
          formData.remarks
        );

        Swal.fire("Success", "Project created successfully!", "success");

      }

      setIsModalOpen(false);
    }
    catch (error: any) {
      console.log("Error creating project:", error)
            Swal.fire("Error", error?.message || "Something went wrong", "error");
    }


    

  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">Projects Table</h1>

      <div className="mb-4">
        <button onClick={openAddModal} className="bg-green-900 text-white px-4 py-2 rounded hover:bg-black">
          Add Project
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="text-left py-3 px-6">Name</th>
              <th className="text-left py-3 px-6">Constituency</th>
              <th className="text-left py-3 px-6">Program</th>
              <th className="text-left py-3 px-6">Budget</th>
              <th className="text-left py-3 px-6">Status</th>
              <th className="text-left py-3 px-6">Start</th>
              <th className="text-left py-3 px-6">End</th>
              <th className="text-left py-3 px-6">Beneficiaries</th>
              <th className="text-left py-3 px-6">Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 text-black px-6">{project.name}</td>
                <td className="py-3 text-black px-6">
                  {
                    constituencies.find((c) => c.id === project.constituency)?.name || "Unknown"
                  }
                </td>
                <td className="py-3 text-black px-6">
                  {
                    programType.find((p) => p.id === project.program)?.name || "Unknown"
                  }
                </td>

                <td className="py-3 text-black px-6">{project.allocated_budget.toLocaleString()}</td>
                <td className="py-3 text-black px-6">{project.status}</td>
                <td className="py-3 text-black px-6">{project.start_date}</td>
                <td className="py-3 text-black px-6">{project.end_date}</td>
                <td className="py-3 text-black px-6">{project.beneficiaries_count}</td>
                <td className="py-3 text-black px-6">
                  <Link
                    href={`/project-view/${project.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="px-3 py-1 bg-green-900 rounded hover:bg-gray-300">
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded hover:bg-gray-300 ${currentPage === i + 1 ? "bg-black text-white" : "bg-white text-black"}`}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className="px-3 py-1 bg-green-900 rounded hover:bg-gray-300">
          Next
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
    <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-lg w-[700px] p-6 relative text-black overflow-y-auto max-h-[90vh]">
      <h2 className="text-2xl font-bold mb-4">
        {editingProject ? "Edit Project" : "Add Project"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Project Name */}
        <div>
          <label>Project Name</label>
          <input
            type="text"
            placeholder="Project Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />
        </div>

        {/* Constituency */}
        <div>
          <label>Constituency</label>
          <select
            value={formData.constituency}
            onChange={(e) =>
              setFormData({
                ...formData,
                constituency: Number(e.target.value),
              })
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          >
            <option value={0} disabled>
              Select Constituency
            </option>
            {constituencies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Project Type */}
        <div>
          <label>Project Type</label>
          <select
            value={formData.program}
            onChange={(e) =>
              setFormData({ ...formData, program: Number(e.target.value) })
            }
            className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          >
            <option value={0} disabled>
              Select Project Type
            </option>
            {programType.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

        </div>

        {/* Beneficiaries Count */}
        <div>
          <label>Beneficiaries Count</label>
          <input
            type="number"
            placeholder="Beneficiaries Count"
            value={formData.beneficiaries_count}
            onChange={(e) =>
              setFormData({
                ...formData,
                beneficiaries_count: Number(e.target.value),
              })
            }
            className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />
        </div>

        {/* Allocated Budget */}
        <div>
          <label>Allocated Budget</label>
          <input
            type="number"
            placeholder="Allocated Budget"
            value={formData.allocated_budget}
            onChange={(e) =>
              setFormData({
                ...formData,
                allocated_budget: Number(e.target.value),
              })
            }
            className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />
        </div>

        {/* Start Date */}
        <div>
          <label>Start Date</label>
          <input
            type="date"
            placeholder="Start Date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* End Date */}
        <div>
          <label>End Date</label>
          <input
            type="date"
            placeholder="End Date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label>Description</label>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
            required
          ></textarea>
        </div>

        {/* Remarks */}
        <div className="col-span-2">
          <label>Remarks</label>
          <textarea
            placeholder="Remarks"
            value={formData.remarks}
            onChange={(e) =>
              setFormData({ ...formData, remarks: e.target.value })
            }
            rows={3}
            className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 rounded bg-red-500 hover:bg-gray-400 text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-900 text-white hover:bg-black"
          >
            {editingProject ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}


    </div>
  );
};

export default ProjectsTable;
