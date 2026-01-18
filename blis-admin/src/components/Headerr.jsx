import React from "react";

function Headerr({ title, subtitle }) {
  return (
    <div className="mb-1">
      <h6 className="font-medium text-md text-gray-800">{title}</h6>
      <p className=" font-medium text-sm text-gray-800">{subtitle}</p>
    </div>
  );
}

export default Headerr;
