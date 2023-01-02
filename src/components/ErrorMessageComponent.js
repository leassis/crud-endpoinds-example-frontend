import React from "react";

export const ErrorComponent = ({ errors = [] }) => {
  return (
    <div className="w-75 mx-auto">
      {errors.map((e, i) => (
        <div
          key={`message${i}`}
          className=" border rounded text-center mb-1 px-1 py-1 text-bg-danger"
        >
          {e}
        </div>
      ))}
    </div>
  );
};
