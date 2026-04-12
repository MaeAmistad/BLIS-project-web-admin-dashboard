import {
  AddCircleOutlineRounded,
  DeleteRounded,
  EditRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import Sidebarr from "../global/Sidebar";
import Topbar from "../global/Topbar";
import Headerr from "../../components/Headerr";
import ProjectManagement from "../../components/ProjectManagement";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [isProjectLoading, setIsProjectLoading] = useState(true);

  const [openProject, setOpenProject] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedDispersal, setSelectedDispersal] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);

  const getTimestamp = (ts) => {
    if (!ts) return 0;

    if (ts.seconds) return ts.seconds * 1000;
    return new Date(ts).getTime();
  };

  const filteredProject = projects
    .filter((item) => {
      const matchesSearch = item.projectName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      // const matchesCategory =
      //   selectedCategory === "" || item.category === selectedCategory;

      return matchesSearch;
    })
    .sort((a, b) => {
      const aLastActivity = Math.max(
        getTimestamp(a.createdAt),
        getTimestamp(a.updatedAt),
      );

      const bLastActivity = Math.max(
        getTimestamp(b.createdAt),
        getTimestamp(b.updatedAt),
      );

      return bLastActivity - aLastActivity;
    });

//   const handleAddDispersal = () => {
//     setOpenDispersal(true);
//     setMode("add");
//     setSelectedDispersal(null);
//   };
  const handleAddProject = () => {
    setOpenProject(true);
    setMode("add");
    setSelectedDispersal(null);
  };

  return (
    <div className="app flex flex-col md:flex-row">
      <Sidebarr />
      <div className="content flex-grow p-2 overflow-auto h-screen">
        <Topbar />
        <div className="sticky top-14 flex flex-col md:flex-row items-start md:items-center justify-between p-1 m-2">
          <Headerr title="Project Management" />

          <div className="flex gap-2 mt-2 md:mt-0">
            <button
              className="bg-green-600 text-white text-xs py-2 px-3 rounded-lg flex items-center gap-1"
              onClick={handleAddProject}
            >
              <AddCircleOutlineRounded fontSize="small" />
              Add Project
            </button>

            {/* <button className="bg-green-600 text-white text-xs py-2 px-3 rounded-lg flex items-center gap-1"
            onClick={handleAddDispersal}>
              <AddCircleOutlineRounded fontSize="small" />
              Add Dispersal
            </button> */}
          </div>
        </div>

        {/* Main Body */}
        <div className="m-1 mt-1 flex-grow overflow-y-auto bg-white-main shadow-md rounded-md">
          {/* SEARCH FILTERINGS */}
          <div className="p-1">
            <div className="flex flex-col sm:flex-row gap-2 my-1 mx-1">
              <input
                type="text"
                placeholder="Search Inventory"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:max-w-xs border border-green-400 rounded-lg px-3 py-2 text-xs"
              />

              {/* <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:max-w-xs border border-green-400 rounded-lg px-3 py-2 text-xs"
              >
                <option value="" className="text-sm">
                  All Categories
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select> */}
            </div>
          </div>

          {/* TABLE */}
          <div className="relative overflow-y-auto h-[550px] border border-gray-300 rounded-md">
            <table className="min-w-[500px] w-full text-center">
              <thead className="h-6 bg-primary uppercase sticky top-0 text-white text-xs z-10">
                <tr>
                  <th className="w-[50px]">NO</th>
                  <th className="w-[200px]">Project Name</th>
                  <th className="w-[120px]">Animal Type</th>
                  <th className="w-[100px]">Target Beneficiaries</th>
                  <th className="w-[100px]">Description</th>
                  <th className="w-[120px]">Start Date</th>
                  <th className="w-[120px]">End Date</th>
                  <th className="w-[50px]">Action</th>
                </tr>
              </thead>

              <tbody>
                {isProjectLoading ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-6 text-gray-500 text-sm text-center"
                    >
                      Loading project items...
                    </td>
                  </tr>
                ) : filteredProject.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="py-6 text-gray-500 text-sm text-center"
                    >
                      No project found
                    </td>
                  </tr>
                ) : (
                  filteredProject.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-green-100 text-xs"
                    >
                      <td className="p-2 text-center border border-gray-400">
                        {index + 1}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {item.projectName}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {item.animalType ?? "-"}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {item.targetBeneficiaries ?? "-"}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {item.description ?? "-"}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {item.startDate ? new Date(item.startDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-2 text-center border border-gray-400">
                        {item.endDate ? new Date(item.endDate).toLocaleDateString()
                          : "-"}
                      </td>
                      
                      {/* Actions */}
                      <td className="p-2 text-center border border-gray-400">
                        <div className="flex justify-center">
                          <IconButton aria-label="edit">
                            <VisibilityRounded
                              sx={{ color: "#e2c018ff", fontSize: 14 }}
                            />
                          </IconButton>
                          <IconButton aria-label="edit">
                            <EditRounded
                              sx={{ color: "#266b0f", fontSize: 14 }}
                            />
                          </IconButton>
                          {isAdmin && (
                            <IconButton aria-label="delete">
                              <DeleteRounded
                                sx={{ color: "#a30808", fontSize: 14 }}
                              />
                            </IconButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {openProject && (
          <ProjectManagement
            open={openProject}
            onClose={() => setOpenProject(false)}
            mode={mode}
            project={selectedProject}
          />
        )}
      </div>
    </div>
  );
};

export default Project;
