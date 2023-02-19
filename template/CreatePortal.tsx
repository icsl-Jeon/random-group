import Chip from "@/components/Chip";
import React, { useState } from "react";
import Modal from "@/components/Modal";
import AttributeTypeEditor from "@/components/AttributeTypeEditor";

interface Props {}

const CreatePortal: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={`flex items-center px-4 py-2 mx-1 relative transition duration-300 hover:bg-slate-200 rounded-full text-gray-500 bg-slate-100 text-sm flex align-center cursor-pointer transition duration-300 ease w-max	my-2`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="black"
          className="w-6 h-6"
        >
          {" "}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m6-6H6"
          />{" "}
        </svg>
        <span className="font-semibold">New attribute</span>
      </div>
      <Modal
        title={"Edit attribute"}
        isOpen={isOpen}
        setIsOpen={() => {
          setIsOpen(!isOpen);
        }}
      >
        <AttributeTypeEditor
          initialAttributeType={{
            key: 0,
            name: "Personality",
            optionList: [
              { key: 0, name: "Extroverted" },
              { key: 1, name: "Introverted" },
            ],
            newOptionKey: 2,
          }}
        ></AttributeTypeEditor>
      </Modal>
    </div>
  );
};

export default CreatePortal;
