import { doc, setDoc, getDocs, collection, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"; 
import { Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";

const RaiserProfile = () => {
  const [fname, setFname] = useState('');
  const [middleinitial, setMiddleinitial] = useState('');
  const [lastname, setLastname] = useState('');
  const [municipal, setMunicipal] = useState('');
  const [brgy, setBrgy] = useState('');
  const [farmsize, setFarmsize] = useState('');
  const [raisers, setRaisers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const Rows = [
    { tableHeader: "ID" },
    { tableHeader: "Full Name" },
    { tableHeader: "Municipal" },
    { tableHeader: "Barangay" },
    { tableHeader: "Farm Size" },
    { tableHeader: "Actions" },
  ];

  const saveData = async () => {
    const datas = {
      fname,
      middleinitial,
      lastname,
      municipal,
      brgy,
      farmsize,
    };

    const capitalizedData = Object.fromEntries(
      Object.entries(datas).map(([key, value]) => [
        key,
        typeof value === "string" ? value.toUpperCase() : value,
      ])
    );

    const docRef = doc(collection(db, "raisers"));
    await setDoc(docRef, {
      name:
        capitalizedData.lastname +
        ", " +
        capitalizedData.fname +
        " " +
        capitalizedData.middleinitial,
      municipal: capitalizedData.municipal,
      barangay: capitalizedData.brgy,
      farmsize: capitalizedData.farmsize,
    });

    setFname("");
    setMiddleinitial("");
    setLastname("");
    setMunicipal("");
    setBrgy("");
    setFarmsize("");
    fetchData();

    Swal.fire({
      icon: "success",
      title: "Raiser Added",
      text: "The new raiser has been added successfully!",
      confirmButtonColor: "#4CAF50",
    });
  };

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "raisers"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRaisers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (raiser) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Raiser",
      html: `
        <input id="fname" class="swal2-input" placeholder="Full Name" value="${raiser.name}" />
        <input id="municipal" class="swal2-input" placeholder="Municipal" value="${raiser.municipal}" />
        <input id="barangay" class="swal2-input" placeholder="Barangay" value="${raiser.barangay}" />
        <input id="farmsize" class="swal2-input" placeholder="Farm Size" value="${raiser.farmsize}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#d33",
      preConfirm: () => {
        const fname = document.getElementById("fname").value;
        const municipal = document.getElementById("municipal").value;
        const barangay = document.getElementById("barangay").value;
        const farmsize = document.getElementById("farmsize").value;
        return { fname, municipal, barangay, farmsize };
      },
    });

    if (formValues) {
      await updateDoc(doc(db, "raisers", raiser.id), {
        name: formValues.fname.toUpperCase(),
        municipal: formValues.municipal.toUpperCase(),
        barangay: formValues.barangay.toUpperCase(),
        farmsize: formValues.farmsize.toUpperCase(),
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Raiser details have been updated successfully.",
        confirmButtonColor: "#4CAF50",
      });

      fetchData();
    }
  };

  // 🔍 Filter function for name or barangay
  const filteredRaisers = raisers.filter((raiser) => {
    const term = searchTerm.toLowerCase();
    return (
      raiser.name.toLowerCase().includes(term) ||
      raiser.barangay.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen">
      <Sidebarr />
      <div className="w-full">
        <Topbar />

        <div className="flex justify-between items-center">
          <Header title="List of Raiser" />
        </div>

        <div className="flex bg-white p-4 m-5 rounded-lg shadow-md">
          {/* TABLE + SEARCH */}
          <div className="w-3/4 overflow-x-auto">
            <div className="flex justify-between items-center mb-3 mt-2">
              <TextField
                label="Search by Name or Barangay"
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#4CAF50",
                    },
                    "&:hover fieldset": {
                      borderColor: "#388E3C",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2E7D32",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#4d504dff",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#2E7D32",
                  },
                }}
              />
            </div>

            <table className="table-auto w-full border-collapse rounded-lg">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  {Rows.map((rows, index) => (
                    <th
                      key={index}
                      className="p-3 text-sm font-semibold tracking-wide text-center"
                    >
                      {rows.tableHeader}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRaisers.length > 0 ? (
                  filteredRaisers.map((raiser, index) => (
                    <tr
                      key={raiser.id}
                      className="border-b hover:bg-green-50 text-center transition-all"
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-medium">{raiser.name}</td>
                      <td className="p-3">{raiser.municipal}</td>
                      <td className="p-3">{raiser.barangay}</td>
                      <td className="p-3">{raiser.farmsize}</td>
                      <td className="p-3">
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: " #4CAF50",
                            "&:hover": { backgroundColor: " #68ca6bff" },
                          }}
                          onClick={() => handleEdit(raiser)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={Rows.length}
                      className="text-center py-6 text-gray-500"
                    >
                      No raisers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ADD FORM */}
          <div className="w-1/4 ml-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-[#fafafa]">
            <form>
              <h4 className="font-bold text-lg text-center text-green-700">
                Add Raiser
              </h4>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  required
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 mt-1 focus:outline-green-500 uppercase"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Middle Initial
                </label>
                <input
                  value={middleinitial}
                  onChange={(e) => setMiddleinitial(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 mt-1 focus:outline-green-500 uppercase"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  required
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 mt-1 focus:outline-green-500 uppercase"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Municipal
                </label>
                <input
                  required
                  value={municipal}
                  onChange={(e) => setMunicipal(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 mt-1 focus:outline-green-500 uppercase"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Barangay
                </label>
                <input
                  required
                  value={brgy}
                  onChange={(e) => setBrgy(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 mt-1 focus:outline-green-500 uppercase"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Farm Size
                </label>
                <input
                  value={farmsize}
                  onChange={(e) => setFarmsize(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 mt-1 focus:outline-green-500 uppercase"
                />
              </div>

              <div className="text-center mt-6">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#4CAF50",
                    px: 5,
                    "&:hover": { backgroundColor: "#45a049" },
                  }}
                  onClick={saveData}
                >
                  ADD
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaiserProfile;
