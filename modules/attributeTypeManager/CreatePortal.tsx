import React, { useState } from "react";
import Modal from "@/layout/Modal";
import AttributeTypeEditor from "@/modules/attributeTypeManager/AttributeTypeEditor";
import { AttributeType } from "@/lib/types";

interface Props {
  onAttributeTypeAdd: (attributeType: AttributeType) => void;
}

const CreatePortal: React.FC<Props> = ({ onAttributeTypeAdd }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={`flex items-center px-4 py-3  sm:py-2 mx-1 relative transition duration-300 hover:bg-sky-600 rounded-full text-gray-500 bg-sky-500 text-sm flex align-center cursor-pointer transition duration-300 ease w-max	my-2`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-6 h-6"
        >
          {" "}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m6-6H6"
          />{" "}
        </svg>
        <span className=" text-white">New attribute</span>
      </div>
      <Modal
        title={"Create attribute"}
        isOpen={isOpen}
        setIsOpen={() => {
          setIsOpen(!isOpen);
        }}
      >
        <AttributeTypeEditor
          initialAttributeType={{
            key: -1,
            name: "Personality (example)",
            optionList: [
              { key: 0, name: "Extroverted" },
              { key: 1, name: "Introverted" },
            ],
            newOptionKey: 2,
            isAppliedToMemberList: false,
            isStrict: false,
          }}
          toggleModal={() => {
            setIsOpen(false);
          }}
          onAttributeTypeUpdate={onAttributeTypeAdd}
        ></AttributeTypeEditor>
      </Modal>
    </div>
  );
};

export default CreatePortal;
