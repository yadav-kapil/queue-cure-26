import React from "react";
import { useNavigate } from "react-router";
import { FiAlertCircle, FiHome, FiSearch } from "react-icons/fi";

const NoSession = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <FiAlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Active Session Found
          </h2>
          <p className="text-gray-600 mb-6">
            The tracking link is invalid or the consultation session no longer
            exists.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/patient/track")}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiSearch className="mr-2 -ml-1 h-5 w-5" />
              Track Another Queue
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiHome className="mr-2 -ml-1 h-5 w-5" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoSession;
