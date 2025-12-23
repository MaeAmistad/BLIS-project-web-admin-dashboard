import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import Headerr from "../../components/Headerr";

const ReportandAnalytics = () => {
  const Rows = [
    { tableHeader: "Date" },
    { tableHeader: "Name of Owner" },
    { tableHeader: "Contact Num." },
    { tableHeader: "Address" },
  ];

  return (
    <div className="app flex flex-col md:flex-row">
      <Sidebarr />
      <div className="content flex-grow p-2 overflow-auto h-screen">
        <Topbar />

        <div className="flex flex-col md:flex-row justify-between p-1 m-2 sticky top-14">
          <Headerr title="Reports and Analytics" />
        </div>

        <div className="m-1 mt-1 flex-grow overflow-y-auto bg-white shadow-md rounded-md">
          {/* Search Filter */}
          <div className="p-1">
            <div className="h-10">
              <div className="flex my-1 mx-1 space-x-1">
                {/* add date selection here */}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex flex-row space-x-5 mt-3 mx-2.5">
            <div className="relative overflow-auto h-[400px] border w-full border-gray-300 rounded-md">
              <table className="min-w-[300px] w-full text-center">
                <thead className="h-6 bg-primary uppercase sticky top-0 text-white text-sm">
                  <tr>
                    {Rows.map((rows, index) => (
                      <th
                        key={index}
                        class="p-3 text-sm font-semibold tracking-wide text-center"
                      >
                        {rows.tableHeader}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportandAnalytics;
