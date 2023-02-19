import React, { useState } from "react";
import { Transition } from "@headlessui/react";

interface Props {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<Props> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      <h2 className="">
        <button
          type="button"
          className="rounded-t-md flex items-center shadow-sm justify-between bg-slate-50  w-full p-5 font-medium text-left text-gray-500 border border-gray-200  focus:ring-slate-200 hover:bg-slate-100 transition-transform duration-300"
          data-accordion-target="#accordion-collapse-body-1"
          aria-expanded="true"
          aria-controls="accordion-collapse-body-1"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <span>{title}</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`h-6 w-6 transform ${isOpen ? "rotate-180" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={"M19.5 8.25l-7.5 7.5-7.5-7.5"}
            />
          </svg>
        </button>
      </h2>

      <Transition
        show={isOpen}
        enter="transition-all ease-out duration-100"
        enterFrom="max-h-0"
        enterTo="max-h-full"
        leave="transition-all ease-out duration-100"
        leaveFrom="max-h-full"
        leaveTo="max-h-0 "
      >
        <div className="overflow-hidden p-4 border-2 border-b-gray-100">
          {" "}
          {children}{" "}
        </div>
      </Transition>
    </div>
  );
};

export default Accordion;
