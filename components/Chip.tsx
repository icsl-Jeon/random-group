import React, { useState } from "react";

interface Props {
  children: React.ReactNode;
}

const Chip = ({ children }: Props) => {
  return (
    <div
      className={`align-center ease relative mx-1 my-2 flex w-max cursor-pointer rounded-full bg-slate-100 text-sm text-gray-500 transition transition duration-300 duration-300	hover:bg-slate-200`}
    >
      <span className="flex items-center py-2 pl-3 pr-1">{children}</span>
    </div>
  );
};

export default Chip;
