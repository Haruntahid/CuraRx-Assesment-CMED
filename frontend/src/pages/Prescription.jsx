import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Prescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch prescriptions
  useEffect(() => {
    axios
      .get(`http://localhost:8000/all-prescription`, {
        params: {
          page,
          limit: 10,
          searchName,
          startDate,
          endDate,
        },
      })
      .then((res) => {
        setPrescriptions(res.data.prescriptions);
        setTotalPages(res.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching prescriptions:", error);
      });
  }, [page, searchName, startDate, endDate]);

  // Reset filters
  const resetFilters = () => {
    setSearchName("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
    setPage(1);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setPage(1);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setPage(1);
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="p-6">
      <h2 className="text-6xl text-center bg-blue-500 py-6 text-white rounded-lg font-bold mb-4">
        All Prescriptions
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-center mb-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Search</label>
          <input
            type="text"
            value={searchName}
            onChange={handleSearchNameChange}
            placeholder="Search by name"
            className="border border-gray-300 p-2 rounded w-52"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">From</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">To</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        <button
          onClick={resetFilters}
          className="ml-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr className="text-center">
            <th className="py-2 px-4 border-b-2 uppercase text-left text-sm font-semibold">
              No
            </th>
            <th className="py-2 px-4 border-b-2 uppercase text-sm font-semibold">
              Patient Name
            </th>
            <th className="py-2 px-4 border-b-2 uppercase text-sm font-semibold">
              Patient Age
            </th>
            <th className="py-2 px-4 border-b-2 uppercase text-sm font-semibold">
              Patient Gender
            </th>
            <th className="py-2 px-4 border-b-2 uppercase text-sm font-semibold">
              Prescription Date
            </th>
            <th className="py-2 px-4 border-b-2 uppercase text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription, index) => (
            <tr
              key={prescription._id}
              className={`text-center ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="py-3 px-4 text-left border-b text-gray-700">
                {index + 1 + (page - 1) * 10}
              </td>
              <td className="py-3 px-4 capitalize border-b text-gray-700">
                {prescription.patientName}
              </td>
              <td className="py-3 px-4 border-b text-gray-700">
                {prescription.patientAge}
              </td>
              <td className="py-3 px-4 capitalize border-b text-gray-700">
                {prescription.patientGender}
              </td>
              <td className="py-3 px-4 border-b text-gray-700">
                {new Date(prescription.prescriptionDate).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 border-b">
                <Link
                  to={`/prescription/${prescription._id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className={`${
            page === 1 ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"
          } text-white font-bold py-2 px-4 rounded`}
        >
          Previous
        </button>
        <span className="text-sm font-medium text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className={`${
            page === totalPages
              ? "bg-gray-300"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-bold py-2 px-4 rounded`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Prescription;
