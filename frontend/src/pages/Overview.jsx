import { useEffect, useState } from "react";
import axios from "axios";

const OverviewTable = () => {
  const [overviewData, setOverviewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  // Function to fetch overview data with month as a parameter
  const fetchOverviewData = async (selectedMonth) => {
    try {
      const response = await axios.get("http://localhost:8000/overview", {
        params: { month: selectedMonth },
      });
      setOverviewData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching overview data:", error);
      setError("Failed to fetch overview data.");
      setLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchOverviewData(selectedMonth);
  }, [selectedMonth]);

  // Handler for month dropdown change
  const handleMonthChange = (event) => {
    const selected = event.target.value;
    setSelectedMonth(selected);
  };

  // Months array for dropdown
  const months = [
    { value: "", label: "Select a month" },
    { value: "1", label: "January 2024" },
    { value: "2", label: "February 2024" },
    { value: "3", label: "March 2024" },
    { value: "4", label: "April 2024" },
    { value: "5", label: "May 2024" },
    { value: "6", label: "June 2024" },
    { value: "7", label: "July 2024" },
    { value: "8", label: "August 2024" },
    { value: "9", label: "September 2024" },
    { value: "10", label: "October 2024" },
    { value: "11", label: "November 2024" },
    { value: "12", label: "December 2024" },
  ];

  // Conditional rendering
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Prescription Overview</h2>

      {/* Month Dropdown */}
      <select
        value={selectedMonth}
        onChange={handleMonthChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      >
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Date</th>
            <th className="py-2 px-4 border">Prescription Count</th>
          </tr>
        </thead>
        <tbody>
          {overviewData.length > 0 ? (
            overviewData.map((data) => (
              <tr key={data.date}>
                <td className="py-2 px-4 border">{data.date}</td>
                <td className="py-2 px-4 border">{data.count}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="py-2 px-4 border text-center">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OverviewTable;
