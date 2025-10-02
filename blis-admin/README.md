# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


<!-- YOUTUBE BUILDING COMPLETE REACT ADMIN DASHBOARD -->
TIME STOP: 45:00

<!-- Table  -->
import { IconButton } from "@mui/material";
import Header from "../../components/header";
import {
  CancelRounded,
  DeleteRounded,
  EditRounded,
  SaveAltRounded,
} from "@mui/icons-material";
import { useEffect, useState } from "react";


const Warehouse = () => {
  const [warehouse, setWarehouse] = useState([]);
  const [mode, setMode] = useState("add");
  const [data, setData] = useState({
    jo: "",
    name: "",
    address: "",
    contact: "",
    remarks: "",
  });
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

//   useEffect(() => {
//     const getWarehouse = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/warehouse`);
//         setWarehouse(res.data);
//         console.log(res.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     getWarehouse();
//   }, []);

  // handle passing values to input box
  useEffect(() => {
    // condition for edit function
    if (mode === "edit" && selectedWarehouse) {
      setData({
        jo: selectedWarehouse.WH_JO || "",
        name: selectedWarehouse.WH_Name || "",
        address: selectedWarehouse.WH_Address || "",
        contact: selectedWarehouse.WH_ContactNumber || "",
        remarks: selectedWarehouse.WH_Remarks || "",
      });
    }
  }, [selectedWarehouse, mode]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  // handle deletion of categories
//   const deleteWarehouse = (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         //delete data here
//         try {
//           axios
//             .delete(`${BASE_URL}/warehouse/${id}`)
//             .then(() => {
//               Swal.fire({
//                 title: "Deleted!",
//                 text: "Warehouse has been deleted.",
//                 icon: "success",
//               });
//               // update the categories list or remove the deleted warehouse from the state
//               setWarehouse((prevCategories) =>
//                 prevCategories.filter((warehouse) => warehouse.id !== id)
//               );
//             })
//             .catch((error) => {
//               Swal.fire({
//                 title: "Error!",
//                 text: "Warehouse could not be deleted.",
//                 icon: "error",
//               });
//               console.error(error);
//             });
//         } catch (error) {
//           console.error("Error deleting warehouse:", error);
//           Swal.fire({
//             title: "Error!",
//             text: "There was an error deleting the warehouse.",
//             icon: "error",
//           });
//         }
//       }
//     });
//   };

  const handleEditClick = (warehouse) => {
    setMode("edit");
    setSelectedWarehouse(warehouse);
  };

  // function for button - edit or add
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // function for submit button whether to data is new or to be updated
//     try {
//       if (mode === "add") {
//         await axios.post(`${BASE_URL}/warehouse`, data);
//         alert("Warehouse added successfully!");
//       } else if (mode === "edit") {
//         await axios.put(
//           `${BASE_URL}/warehouse/${selectedWarehouse.WH_ID}`,
//           data
//         );
//         alert("Warehouse updated successfully!");
//         setMode("add"); // Switch back to add mode
//         setSelectedWarehouse(null); // Clear selected category
//         setData({ jo: "", name: "", address: "", contact: "", remarks: "" }); // Clear form
//       }
//       setData({
//         jo: "",
//         name: "",
//         address: "",
//         contact: "",
//         remarks: "",
//       });
//     } catch (error) {
//       console.error("Error saving Warehouse:", error);
//       alert("Error saving Warehouse: " + error);
//     }
//   };

  // function for cancel edit
  const handleCancel = () => {
    setMode("add");
    setSelectedWarehouse(null);
    setData({ jo: "", name: "", address: "", contact: "", remarks: "" });
  };

  return (
    <div className="app flex min-h-screen">
      {/* <Sidebar /> */}

      <div className="content flex-grow p-2 overflow-auto h-screen">
        {/* <Topbar /> */}

        <div style={{ margin: "20px" }}>
          <div className="flex justify-between p-2">
            <Header title="Vaccination & Treatment" />

            {/* Uncomment this if you want to use the Add New button
    <div>
      <button className="bg-blue-500 text-white py-2 px-4 rounded flex items-center">
        <AddCircleOutlineRounded className="mr-2" />
        Add New
      </button>
    </div>
    */}
          </div>
          
          <div>
            <button className="border p-2 rounded-xl bg-#F5F5F5 mr-5">Vaccinated</button>
            <button className="border p-2 rounded-xl bg-#F5F5F5 ">Unvaccinated</button>
          </div>

          <div className="shadow-md w-full">
            <div>
              {/* <div className="text-blue-800">
                <p className="text-base pt-1">Filter By:</p>
              </div> */}

              {/* <div className="h-12">
                <div className="flex flex-row space-x-4 mt-3 mx-2.5">
                  <select className="w-56 h-8 rounded-lg p-1 border-2 border-current">
                    <option value=" ">Warehouse Name</option>
                    {warehouse && warehouse !== undefined
                      ? warehouse.map((warehouses) => {
                          return (
                            <option
                              key={warehouses.WH_ID}
                              value={warehouses.WH_Name}
                            >
                              {warehouses.WH_Name}
                            </option>
                          );
                        })
                      : "Select Name"}
                  </select>
                </div>
              </div> */}
            </div>

            <div className="flex flex-row space-x-10 mt-3 mx-2.5">
              <div className="overflow-auto h-[500px] p-2 w-full border-gray-300 shadow-md">
                <table className="min-w-[350px] w-full text-center">
                  <thead className="h-8 bg-dark-blue uppercase sticky top-0 text-white-main text-sm">
                    <tr>
                      <th className="w-[50px]">NO</th>
                      <th className="w-[50px]">Name of Owner</th>
                      <th className="w-[50px]">Contact No.</th>
                      <th className="w-[50px]">Species</th>
                      <th className="w-[50px]">Pet Name</th>
                      <th className="w-[150px]">Sex</th>
                      <th className="w-[150px]">Age</th>
                      <th className="w-[150px]">Vaccined Used</th>
                      <th className="w-[220px]">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warehouse.map((row) => (
                      <tr key={row.WH_ID} className="h-5 last:border-0 odd:bg-gray-300 even:bg-gray-200">
                        <td>{row.WH_ID}</td>
                        <td>{row.WH_JO}</td>
                        <td>{row.WH_Name}</td>
                        <td>{row.WH_ContactNumber}</td>
                        <td>{row.WH_Address}</td>
                        <td>{row.WH_Remarks}</td>
                        <td>
                          <div className="flex justify-center space-x-1.5">
                            <IconButton
                              aria-label="edit"
                              onClick={() => handleEditClick(row)}
                            >
                              <EditRounded
                                sx={{ color: "#266b0f", fontSize: 16 }}
                              />
                            </IconButton>

                            <IconButton
                              aria-label="delete"
                            //   onClick={() => deleteWarehouse(row.WH_ID)}
                            >
                              <DeleteRounded
                                sx={{ color: "#a30808", fontSize: 16 }}
                              />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* <div className="bg-white rounded-xl border border-current w-96 p-4"> */}
                {/* <form>
                  <div className="flex justify-between items-center p-2 bg-gray-100 rounded-xl">
                    <p className="font-bold text-center">
                      {mode === "add" ? "Add Raiser" : "Edit Warehouse"}
                    </p>

         
                  </div>

              
                  <div className="mt-1 p-1">
                    <div className="mt-1">
                      <p className="text-base">Full Name</p>
                      <input
                        type="text"
                        className="w-full h-10 border border-current p-2 text-xs rounded-xl"
                        name="jo"
                        value={data.jo}
                        onChange={handleInput}
                        required
                      />
                    </div>

                    <div className="mt-1">
                      <p className="text-base">Barangay</p>
                      <input
                        type="text"
                        className="w-full h-10 border border-current p-2 text-xs rounded-xl"
                        name="name"
                        value={data.name}
                        onChange={handleInput}
                        required
                      />
                    </div>

                    <div className="mt-1">
                      <p className="text-base">Municipal</p>
                      <input
                        type="text"
                        className="w-full h-10 border border-current p-2 text-xs rounded-xl"
                        name="contact"
                        value={data.contact}
                        onChange={handleInput}
                        required
                      />
                    </div>

                    <div className="mt-1">
                      <p className="text-base">Contact No.</p>
                      <input
                        type="text"
                        className="w-full h-10 border border-current p-2 text-xs rounded-xl"
                        name="address"
                        value={data.address}
                        onChange={handleInput}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-center items-center">
                    <button
                      type="submit"
                      className="bg-dark-blue w-28 h-10 rounded-3xl text-white-main my-5 cursor-pointer hover:bg-lighter-blue m-1 flex items-center justify-center"
                    >
                      <SaveAltRounded className="mr-2" />
                      {mode === "add" ? "Add" : "Update"}
                    </button>

                    {mode === "edit" && (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-dark-blue w-28 h-10 rounded-3xl text-white-main my-5 cursor-pointer hover:bg-lighter-blue m-1 flex items-center justify-center"
                      >
                        <CancelRounded className="mr-2 text-white-main" />
                        Cancel
                      </button>
                    )}
                  </div>
                </form> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Warehouse;
