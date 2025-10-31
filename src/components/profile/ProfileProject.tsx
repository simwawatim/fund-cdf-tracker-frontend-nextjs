"use client";
import { useState } from "react";

interface Project {
  name: string;
  constituency: number;
  project_type: string;
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

const initialProjects: Project[] = [
  {
    name: "Lusaka Water Project",
    constituency: 1,
    project_type: "Infrastructure",
    description: "Water supply improvement",
    allocated_budget: 5000000,
    status: "Planned",
    start_date: "2025-10-01",
    end_date: "2026-03-01",
    beneficiaries_count: 5000,
    project_manager: "John Doe",
    funding_source: "CDF",
    location: "Lusaka",
    remarks: "Urgent priority",
  },
  {
    name: "Kitwe School Renovation",
    constituency: 2,
    project_type: "Education",
    description: "Renovation of classrooms and labs",
    allocated_budget: 2000000,
    status: "Ongoing",
    start_date: "2025-06-15",
    end_date: "2025-12-15",
    beneficiaries_count: 1200,
    project_manager: "Mary Banda",
    funding_source: "CDF",
    location: "Kitwe",
    remarks: "High priority",
  },
  {
    name: "Ndola Road Expansion",
    constituency: 3,
    project_type: "Infrastructure",
    description: "Expanding main roads for better traffic flow",
    allocated_budget: 7500000,
    status: "Planned",
    start_date: "2025-11-01",
    end_date: "2026-06-01",
    beneficiaries_count: 8000,
    project_manager: "Peter Mwansa",
    funding_source: "CDF",
    location: "Ndola",
    remarks: "",
  },
  {
    name: "Livingstone Health Clinic Upgrade",
    constituency: 4,
    project_type: "Health",
    description: "Upgrade medical equipment and facilities",
    allocated_budget: 3000000,
    status: "Ongoing",
    start_date: "2025-05-01",
    end_date: "2025-11-01",
    beneficiaries_count: 3500,
    project_manager: "Grace Phiri",
    funding_source: "CDF",
    location: "Livingstone",
    remarks: "Critical need",
  },
  {
    name: "Chingola Solar Electrification",
    constituency: 5,
    project_type: "Energy",
    description: "Install solar panels in rural areas",
    allocated_budget: 4000000,
    status: "Planned",
    start_date: "2025-09-01",
    end_date: "2026-03-01",
    beneficiaries_count: 4500,
    project_manager: "David Zulu",
    funding_source: "CDF",
    location: "Chingola",
    remarks: "",
  },
  {
    name: "Mufulira Market Construction",
    constituency: 6,
    project_type: "Commerce",
    description: "Build new market stalls and storage",
    allocated_budget: 1500000,
    status: "Completed",
    start_date: "2025-01-15",
    end_date: "2025-07-15",
    beneficiaries_count: 2000,
    project_manager: "Linda Mwale",
    funding_source: "CDF",
    location: "Mufulira",
    remarks: "Completed on time",
  },
  {
    name: "Kabwe Library Modernization",
    constituency: 7,
    project_type: "Education",
    description: "Upgrade library infrastructure",
    allocated_budget: 1000000,
    status: "Planned",
    start_date: "2025-12-01",
    end_date: "2026-06-01",
    beneficiaries_count: 800,
    project_manager: "Thomas Lungu",
    funding_source: "CDF",
    location: "Kabwe",
    remarks: "",
  },
  {
    name: "Solwezi Bridge Rehabilitation",
    constituency: 8,
    project_type: "Infrastructure",
    description: "Repair and reinforce old bridge",
    allocated_budget: 6000000,
    status: "Ongoing",
    start_date: "2025-07-01",
    end_date: "2026-01-01",
    beneficiaries_count: 5000,
    project_manager: "Ruth Musonda",
    funding_source: "CDF",
    location: "Solwezi",
    remarks: "Safety critical",
  },
  {
    name: "Ndola Youth Sports Center",
    constituency: 3,
    project_type: "Recreation",
    description: "Build sports facilities for youth",
    allocated_budget: 2500000,
    status: "Planned",
    start_date: "2025-10-15",
    end_date: "2026-04-15",
    beneficiaries_count: 1000,
    project_manager: "Kennedy Phiri",
    funding_source: "CDF",
    location: "Ndola",
    remarks: "",
  },
  {
    name: "Lusaka Public Park Revamp",
    constituency: 1,
    project_type: "Recreation",
    description: "Landscape and renovate public park",
    allocated_budget: 1800000,
    status: "Planned",
    start_date: "2025-11-01",
    end_date: "2026-05-01",
    beneficiaries_count: 3000,
    project_manager: "Alice Tembo",
    funding_source: "CDF",
    location: "Lusaka",
    remarks: "Community priority",
  },
];


const ProfileProject = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const itemsPerPage = 3;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const [formData, setFormData] = useState<Project>({
    name: "",
    constituency: 0,
    project_type: "",
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

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      name: "",
      constituency: 0,
      project_type: "",
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingProject) {
      setProjects(projects.map((p) => (p === editingProject ? formData : p)));
    } else {
      setProjects([...projects, formData]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-black">Projects Table</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="text-left py-3 px-6">Name</th>
              <th className="text-left py-3 px-6">Constituency</th>
              <th className="text-left py-3 px-6">Budget</th>
              <th className="text-left py-3 px-6">Status</th>
              <th className="text-left py-3 px-6">Start</th>
              <th className="text-left py-3 px-6">End</th>
              <th className="text-left py-3 px-6">Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 text-black px-6">{project.name}</td>
                <td className="py-3 text-black px-6">{project.constituency}</td>
                <td className="py-3 text-black px-6">{project.allocated_budget.toLocaleString()}</td>
                <td className="py-3 text-black px-6">{project.status}</td>
                <td className="py-3 text-black px-6">{project.start_date}</td>
                <td className="py-3 text-black px-6">{project.end_date}</td>
                <td className="py-3 text-black px-6">
                  <button onClick={() => openEditModal(project)} className="text-blue-600 hover:underline">
                    Edit
                  </button>
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
          <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-lg w-96 p-6 relative text-black overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4">{editingProject ? "Edit Project" : "Add Project"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {Object.keys(formData).map((field) => (
                <input
                  key={field}
                  type={field === "allocated_budget" || field === "constituency" || field === "beneficiaries_count" ? "number" : "text"}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}
                  value={formData[field as keyof Project]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field]: field === "allocated_budget" || field === "constituency" || field === "beneficiaries_count" ? Number(e.target.value) : e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded text-black"
                  required
                />
              ))}
              <div className="flex justify-end space-x-2 mt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-red-500 hover:bg-gray-400 text-white">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-green-900 text-white hover:bg-black">
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

export default ProfileProject;
