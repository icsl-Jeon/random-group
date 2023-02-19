import React, { useState } from "react";

interface Props {
  children: React.ReactNode;
  color: string;
}

const Chip = ({ children, color }: Props) => {
  return (
    <div
      className={`mx-1 relative transition duration-300 hover:bg-${color}-200 rounded-full text-gray-500 bg-${color}-100 text-sm flex align-center cursor-pointer transition duration-300 ease w-max	my-2`}
    >
      <span className="flex items-center pl-3 pr-1 py-2">{children}</span>
    </div>
  );
};

export default Chip;
