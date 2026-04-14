import {
  AddCircleOutlineRounded,
  DeleteRounded,
  EditRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path if needed
import { useAuth } from "../../components/AuthContext";
import Sidebarr from "../global/Sidebar";
import Topbar from "../global/Topbar";
import Headerr from "../../components/Headerr";
import ProjectManagement from "../../components/ProjectManagement";
import DispersalManagement from "../../components/DispersalManagement";
import Swal from "sweetalert2";

const Dispersal = () => {
  const [dispersal, setDispersal] = useState([]);
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [isDispersalLoading, setIsDispersalLoading] = useState(true);
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [activeTable, setActiveTable] = useState("projects");
  const [raisersMap, setRaisersMap] = useState({});

  const [openDispersal, setOpenDispersal] = useState(false);
  const [openProject, setOpenProject] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedDispersal, setSelectedDispersal] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch projects from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "projects"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(data);
        setIsProjectLoading(false);
      },
      (error) => {
        console.error("Error fetching projects:", error);
        setIsProjectLoading(false);
      },
    );
    return () => unsub();
  }, []);

  // Fetch dispersals from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "dispersals"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const dispersal = doc.data();

          const raiser = raisersMap[dispersal.raiserId];

          return {
            id: doc.id,
            ...dispersal,
            raiserName: raiser?.fullName || "Unknown Raiser",
          };
        });

        setDispersal(data);
        setIsDispersalLoading(false);
      },
      (error) => {
        console.error("Error fetching dispersals:", error);
        setIsDispersalLoading(false);
      },
    );

    return () => unsub();
  }, [raisersMap]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "raisers"), (snapshot) => {
      const map = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        map[doc.id] = {
          id: doc.id,
          fullName:
            `${data.firstName || ""} ${data.middleName || ""} ${data.lastName || ""}`.trim(),
          ...data,
        };
      });

      setRaisersMap(map);
    });

    return () => unsub();
  }, []);

  const getTimestamp = (ts) => {
    if (!ts) return 0;
    if (ts.seconds) return ts.seconds * 1000;
    return new Date(ts).getTime();
  };

  const filteredDispersal = dispersal
    .filter((item) =>
      item.projectName?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
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

  const filteredProject = projects
    .filter((item) =>
      item.projectName?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
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

  const handleAddDispersal = () => {
    setOpenDispersal(true);
    setMode("add");
    setSelectedDispersal(null);
  };

  const handleEditDispersal = (id) => {
   setOpenDispersal(true);
    setMode("edit");
    setSelectedDispersal(id);
  };

  const handleAddProject = () => {
    setOpenProject(true);
    setMode("add");
    setSelectedProject(null);
  };

  const handleEditProject = (id) => {
   setOpenProject(true);
    setMode("edit");
    setSelectedProject(id);
  };

  const handleDeleteDispersal = async (id) => {
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "This dispersal will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (!confirm.isConfirmed) return;

  try {
    await deleteDoc(doc(db, "dispersals", id));

    Swal.fire("Deleted!", "Dispersal has been deleted.", "success");
    setDispersal((prev) => prev.filter((item) => item.id !== id));

  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Failed to delete dispersal", "error");
  }
};

const handleDeleteProject = async (id) => {
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "This project will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (!confirm.isConfirmed) return;

  try {
    await deleteDoc(doc(db, "projects", id));

    Swal.fire("Deleted!", "Project has been deleted.", "success");

    setProjects((prev) => prev.filter((item) => item.id !== id));

  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Failed to delete project", "error");
  }
};

  return (
    <div className="app flex flex-col md:flex-row">
      <Sidebarr />
      <div className="content flex-grow p-2 overflow-auto h-screen">
        <Topbar />
        <div className="sticky top-14 flex flex-col md:flex-row md:items-center justify-between p-1 m-2">
          <Headerr title="Project and Dispersal" />

          <div className="flex items-center gap-1 justify-end w-full md:w-auto">
            <button
              className="bg-green-600 w-32 text-white text-xs py-2 px-3 rounded-lg flex items-center gap-1"
              onClick={handleAddProject}
            >
              <AddCircleOutlineRounded fontSize="small" />
              Add Project
            </button>

            <button
              className="bg-green-600 w-34 text-white text-xs py-2 px-3 rounded-lg flex items-center gap-1"
              onClick={handleAddDispersal}
            >
              <AddCircleOutlineRounded fontSize="small" />
              Add Dispersal
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="m-1 mt-1 flex-grow overflow-y-auto bg-white-main shadow-md rounded-md">
          {/* SEARCH & FILTER */}
          <div className="flex flex-col sm:flex-row gap-2 my-1 mx-1">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-xs border border-green-400 rounded-lg px-3 py-2 text-xs"
            />

            <div className="flex items-center gap-2 justify-end w-full">
              <button
                className={`px-3 w-32 py-2 text-sm rounded-lg ${
                  activeTable === "projects"
                    ? "bg-green-600 text-white"
                    : "bg-black text-white"
                }`}
                onClick={() => setActiveTable("projects")}
              >
                Projects
              </button>

              <button
                className={`px-3 py-2 w-32 text-sm rounded-lg ${
                  activeTable === "dispersal"
                    ? "bg-green-600 text-white"
                    : "bg-black text-white"
                }`}
                onClick={() => setActiveTable("dispersal")}
              >
                Dispersal
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="relative overflow-y-auto h-[550px] border border-gray-300 rounded-md">
            {activeTable === "projects" ? (
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
                    <th className="w-[120px]">Status</th>
                    <th className="w-[50px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isProjectLoading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-6 text-gray-500 text-sm text-center"
                      >
                        Loading project items...
                      </td>
                    </tr>
                  ) : filteredProject.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
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
                          {item.startDate
                            ? new Date(item.startDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="p-2 text-center border border-gray-400">
                          {item.endDate
                            ? new Date(item.endDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="p-2 text-center border border-gray-400">
                          {item.status ?? "-"}
                        </td>
                        <td className="p-2 text-center border border-gray-400">
                          <div className="flex justify-center">
                            <IconButton aria-label="view">
                              <VisibilityRounded
                                sx={{ color: "#e2c018ff", fontSize: 14 }}
                              />
                            </IconButton>
                            <IconButton aria-label="edit">
                              <EditRounded
                              onClick={() => handleEditProject(item)}
                                sx={{ color: "#266b0f", fontSize: 14 }}
                              />
                            </IconButton>
                            {isAdmin && (
                              <IconButton aria-label="delete"
                              onClick={() => handleDeleteProject(item.id)}>
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
            ) : (
              <table className="min-w-[500px] w-full text-center">
                <thead className="h-6 bg-primary uppercase sticky top-0 text-white text-xs z-10">
                  <tr>
                    <th className="w-[50px]">NO</th>
                    <th className="w-[200px]">Project Name</th>
                    <th className="w-[120px]">Raiser Name</th>
                    <th className="w-[100px]">Animal Type</th>
                    <th className="w-[100px]">Quantity</th>
                    <th className="w-[120px]">Dispersal Date</th>
                    <th className="w-[120px]">Status</th>
                    <th className="w-[50px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isDispersalLoading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-6 text-gray-500 text-sm text-center"
                      >
                        Loading dispersal items...
                      </td>
                    </tr>
                  ) : filteredDispersal.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-6 text-gray-500 text-sm text-center"
                      >
                        No dispersal found
                      </td>
                    </tr>
                  ) : (
                    filteredDispersal.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-green-100 text-xs"
                      >
                        <td className="p-2 text-center border border-gray-400">
                          {index + 1}
                        </td>
                        <td className="p-2 text-center border border-gray-400">
                          {item.projectName ?? "-"}
                        </td>
                        <td className="p-2 text-center border border-gray-400">
                          {item.raiserName ?? "-"}
                        </td>
                        <td className="p-2 text-center border border-gray-400">
                          {item.animalType ?? "-"}
                        </td>
                        <td className="p-2 text-center border border-gray-400">
                          {item.quantity ?? "-"}
                        </td>
                        <td className="p-2 text-center border border-gray-400">
                          {item.dispersalDate
                            ? new Date(item.dispersalDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="p-2 text-center border border-gray-400">
                          {item.status ?? "-"}
                        </td>
                        <td className="p-2 text-center border border-gray-400">
                          <div className="flex justify-center">
                            <IconButton aria-label="view">
                              <VisibilityRounded
                                sx={{ color: "#e2c018ff", fontSize: 14 }}
                              />
                            </IconButton>
                            <IconButton aria-label="edit">
                              <EditRounded
                              onClick={() => handleEditDispersal(item)}
                                sx={{ color: "#266b0f", fontSize: 14 }}
                              />
                            </IconButton>
                            {isAdmin && (
                              <IconButton aria-label="delete"
                              onClick={() => handleDeleteDispersal(item.id)}>
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
            )}
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

        {openDispersal && (
          <DispersalManagement
            open={openDispersal}
            onClose={() => setOpenDispersal(false)}
            mode={mode}
            dispersal={selectedDispersal}
          />
        )}
      </div>
    </div>
  );
};

export default Dispersal;
