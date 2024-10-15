import { Link, useLoaderData, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaRegCalendarAlt,
  FaEdit,
  FaTrashAlt,
  FaDownload,
} from "react-icons/fa";
import { GiMedicines, GiHealthNormal } from "react-icons/gi";
import jsPDF from "jspdf";
import RxSymbol from "../assets/Rx.png";
import Swal from "sweetalert2";
import axios from "axios";

function PrescriptionDetails() {
  const data = useLoaderData();
  const navigate = useNavigate();

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Header background
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, 210, 40, "F");

    // Company Name
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("CuraRx", 15, 25);

    // Prescription Date and Next Visit Date on the right
    const dateStr = new Date().toLocaleDateString();
    const nextVisit = data.nextVisitDate
      ? new Date(data.nextVisitDate).toLocaleDateString()
      : "Not scheduled";

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Date: ${dateStr}`, 180, 20, { align: "right" });
    doc.text(`Next Visit: ${nextVisit}`, 180, 30, { align: "right" });

    doc.setTextColor(0, 0, 0);

    // Patient Information Section
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");

    doc.text("Patient Information", 14, 60);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${data.patientName}`, 14, 70);

    // Patient Age on the right side
    doc.text(`Age: ${data.patientAge} years`, 180, 70, { align: "right" });

    // Gender information (Capitalized)
    doc.text(`Gender: ${data.patientGender.toUpperCase()}`, 14, 80);

    doc.line(10, 95, 200, 95);

    // Diagnosis Section
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Diagnosis", 14, 105);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(data.diagnosis, 14, 115);

    doc.line(10, 125, 200, 125);

    // Medicines Section
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Medicine", 14, 135);

    // Rx Symbol
    doc.addImage(RxSymbol, "PNG", 14, 140, 5, 5);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // medicine
    doc.text(data.medicines, 26, 144);

    // Save the PDF
    doc.save("prescription_details.pdf");
  };

  // Placeholder for delete function
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Prescription!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8000/delete-prescription/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "Your Prescription has been deleted.",
                icon: "success",
              });
              navigate("/prescription");
            }
          });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)} // Go back
          className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12H9m0 0l6-6m-6 6l6 6"
            />
          </svg>
          Back
        </button>
      </div>

      <h2 className="text-6xl text-center bg-blue-500 py-6 text-white rounded-lg font-bold mb-4">
        Prescription Details
      </h2>

      {/* Patient Information Section */}
      <div className="border-b border-gray-300 pb-4 mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <FaUserCircle className="mr-2 text-gray-500" />
          Patient Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <p className="text-lg">
            <strong>Name:</strong> {data.patientName}
          </p>
          <p className="text-lg">
            <strong>Age:</strong> {data.patientAge} years
          </p>
          <p className="text-lg">
            <strong>Gender:</strong>{" "}
            <span className="capitalize">{data.patientGender}</span>
          </p>
        </div>
      </div>

      {/* Date Section */}
      <div className="border-b border-gray-300 pb-4 mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <FaRegCalendarAlt className="mr-2 text-gray-500" />
          Dates
        </h2>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <strong>Prescription Date:</strong>
            <p className="mt-1 text-lg">
              {new Date(data.prescriptionDate).toLocaleDateString()}
            </p>
          </div>
          {data.nextVisitDate ? (
            <div>
              <strong>Next Visit Date:</strong>
              <p className="mt-1 text-lg">
                {new Date(data.nextVisitDate).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="text-gray-400">
              <strong>Next Visit Date:</strong>
              <p className="mt-1 text-lg">Not scheduled</p>
            </div>
          )}
        </div>
      </div>

      {/* Diagnosis Section */}
      <div className="border-b border-gray-300 pb-4 mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <GiHealthNormal className="mr-2 text-gray-500" />
          Diagnosis
        </h2>
        <p className="mt-2 text-lg">{data.diagnosis}</p>
      </div>

      {/* Medicines Section */}
      <div>
        <h2 className="text-xl font-semibold flex items-center">
          <GiMedicines className="mr-2 text-gray-500" />
          Medicines Prescribed
        </h2>
        <p className="mt-2 text-lg">{data.medicines}</p>
      </div>

      {/* Action Buttons: Edit, Delete, Download */}
      <div className="flex justify-end mt-8 space-x-4">
        <Link
          to={`/edit-prescription/${data._id}`}
          className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <FaEdit className="mr-2" />
          Edit
        </Link>
        <button
          onClick={() => handleDelete(data._id)}
          className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <FaTrashAlt className="mr-2" />
          Delete
        </button>
        <button
          onClick={generatePDF}
          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <FaDownload className="mr-2" />
          Download Prescription
        </button>
      </div>
    </div>
  );
}

export default PrescriptionDetails;
