import React from "react";

const Redirect = () => {
  return (
    <div className="shadow-lg  mt-10 flex flex-col items-center justify-center rounded-lg p-6 w-full transition-colors duration-300">
      <div className="flex flex-col mt-10 items-center">
        <p className="text-2xl bg-gray-200 p-4">You are not Admin Login Again</p>
        <button
          onClick={() => {
            window.location.href = "/admin";
          }}
          className="border-2 border-gray-300 bg-gray-100 text-gray-800 px-4 py-2 rounded-md mt-4 hover:bg-gray-200 transition-colors duration-300"
          style={{ cursor: "pointer" }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Redirect;
