import React, { useState } from "react";
import { AttributeType } from "@/lib/types";
import Chip from "@/components/Chip";
import Modal from "@/components/Modal";
import AttributeTypeEditor from "@/components/AttributeTypeEditor";

interface Props {
  attributeType: AttributeType;
  onAttributeTypeUpdate: (newAttributeType: AttributeType) => void;
}

const EditPortal = ({ attributeType, onAttributeTypeUpdate }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div>
        <Chip>
          <span className="">{attributeType.name}</span>
          <button
            className=" mx-1 rounded-full p-1 opacity-50 hover:opacity-100 "
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="black"
              className="h-4 w-4"
            >
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
              <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
            </svg>
          </button>
        </Chip>
      </div>
      <Modal
        title={"Edit attribute"}
        isOpen={isOpen}
        setIsOpen={() => {
          setIsOpen(!isOpen);
        }}
      >
        <AttributeTypeEditor
          onAttributeTypeUpdate={onAttributeTypeUpdate}
          initialAttributeType={attributeType}
          toggleModal={() => {
            setIsOpen(false);
          }}
        ></AttributeTypeEditor>
      </Modal>
    </div>
  );
};

export default EditPortal;
