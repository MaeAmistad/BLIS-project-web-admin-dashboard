import React from "react";

function Headerr({ title, subtitle }) {
  return (
    <div className="mb-1">
      <h6 className="text-md text-[#323233] ">{title}</h6>
      <p className="text-[#4c4c4d]">{subtitle}</p>
    </div>
  );
}

export default Headerr;
