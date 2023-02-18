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
          className="rounded-t-md flex items-center shadow-sm justify-between bg-gray-100  w-full p-5 font-medium text-left text-gray-400 border border-gray-200  focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform duration-300"
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
        enter="transition-all ease-out duration-200"
        enterFrom="max-h-0 opacity-0"
        enterTo="max-h-full opacity-100"
        leave="transition-all ease-in duration-200"
        leaveFrom="max-h-full opacity-100"
        leaveTo="max-h-0 opacity-0"
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
