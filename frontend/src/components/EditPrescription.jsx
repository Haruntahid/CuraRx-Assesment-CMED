import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function EditPrescription() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/prescription/${id}`)
      .then((response) => {
        const fetchedData = response.data;
        setData(fetchedData);

        // Format dates
        if (fetchedData.prescriptionDate) {
          fetchedData.prescriptionDate =
            fetchedData.prescriptionDate.split("T")[0];
        }
        if (fetchedData.nextVisitDate) {
          fetchedData.nextVisitDate = fetchedData.nextVisitDate.split("T")[0];
        }

        // Reset form with fetched data
        reset(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching prescription data:", error);
      });
  }, [id, reset]);

  const onSubmit = (formData) => {
    axios
      .put(`http://localhost:8000/edit-prescription/${id}`, formData)
      .then((res) => {
        console.log(res.data);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Prescription Successfully Updated",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(`/prescription/${id}`);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Something went wrong!",
        });
      });
  };

  return (
    <div className="h-screen flex felx-col justify-center items-center w-full">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
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
          Edit Prescription
        </h2>
        {data ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Prescription Date */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Prescription Date
              </label>
              <input
                readOnly
                type="date"
                {...register("prescriptionDate")}
                className="w-full px-4 py-2 border border-gray-400 rounded"
              />
            </div>

            {/* Patient Name */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Patient Name</label>
              <input
                type="text"
                {...register("patientName", {
                  required: "Patient name is required",
                })}
                className="w-full px-4 py-2 border border-gray-400 rounded"
              />
              {errors.patientName && (
                <p className="text-red-500 text-sm">
                  {errors.patientName.message}
                </p>
              )}
            </div>

            {/* Patient Age */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Patient Age</label>
              <input
                type="text"
                {...register("patientAge", {
                  required: "Patient age is required",
                  pattern: {
                    value: /^[1-9][0-9]*$/,
                    message: "Age must be a valid positive number",
                  },
                  min: { value: 1, message: "Age must be at least 1" },
                  max: {
                    value: 100,
                    message: "Age cannot be greater than 100",
                  },
                })}
                className="w-full px-4 py-2 border border-gray-400 rounded"
                inputMode="numeric"
              />
              {errors.patientAge && (
                <p className="text-red-500 text-sm">
                  {errors.patientAge.message}
                </p>
              )}
            </div>

            {/* Patient Gender */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Patient Gender</label>
              <select
                {...register("patientGender", {
                  required: "Patient gender is required",
                })}
                className="w-full px-4 py-2 border border-gray-400 rounded"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.patientGender && (
                <p className="text-red-500 text-sm">
                  {errors.patientGender.message}
                </p>
              )}
            </div>

            {/* Diagnosis */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Diagnosis</label>
              <textarea
                {...register("diagnosis")}
                className="w-full px-4 py-2 border border-gray-400 rounded"
                placeholder="Enter diagnosis"
              />
            </div>

            {/* Medicines */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Medicines</label>
              <textarea
                {...register("medicines")}
                className="w-full px-4 py-2 border border-gray-400 rounded"
                placeholder="Enter medicines"
              />
            </div>

            {/* Next Visit Date */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Next Visit Date (Optional)
              </label>
              <input
                min={new Date().toISOString().split("T")[0]}
                type="date"
                {...register("nextVisitDate", {
                  validate: (value) =>
                    !value ||
                    value > data.prescriptionDate ||
                    "Next visit date must be a future date",
                })}
                className="w-full px-4 py-2 border border-gray-400 rounded"
              />
              {errors.nextVisitDate && (
                <p className="text-red-500 text-sm">
                  {errors.nextVisitDate.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Update Prescription
            </button>
          </form>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default EditPrescription;
