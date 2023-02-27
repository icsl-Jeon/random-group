import React, { useState } from "react";
import { Member, AttributeType } from "@/lib/types";

interface Props {
  members: Member[];
  attributeTypes: AttributeType[];
  onOptionDropdownChange: (
    updatedMemberKey: number,
    attributeTypeKey: number,
    attributeValueKey: number
  ) => void;
}

const MemberTable: React.FC<Props> = ({
  members,
  attributeTypes,
  onOptionDropdownChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: number;
  }>({});

  const handleOptionSelection = (
    memberKey: number,
    attributeTypeKey: number,
    optionId: number
  ) => {
    setSelectedOptions({
      ...selectedOptions,
      [`${memberKey}-${attributeTypeKey}`]: optionId,
    });
  };

  return (
    <div className="sm:p-5 flex flex-col items-center">
      <table className="border-collapse table-auto w-full text-left">
        <thead className="border-b text-sm sm:text-md">
          <tr className="">
            <th className="sm:px-4 py-2  ">Member id</th>
            {attributeTypes.map((attributeType, index) => (
              <th className="px-4 py-2 " key={index}>
                {attributeType.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.key} className="text-sm ">
              <td className="px-4 py-2 flex">
                <button className={"mr-2 rounded-full hover:bg-slate-200"}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="gray"
                    className="w-5 h-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>

                {member.key}
              </td>
              {attributeTypes.map((attributeType) => {
                const attribute = member.attributeList.find(
                  (attr) => attr.attributeTypeKey === attributeType.key
                );
                if (!attribute) return;
                const selectedOptionId = attribute.attributeTypeValue.key;

                return (
                  <td key={attributeType.key} className=" px-2 py-2 text-sm">
                    <select
                      className="bg-white sm:p-2 text-gray-700 text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                      value={selectedOptionId}
                      onChange={(event) => {
                        handleOptionSelection(
                          member.key,
                          attributeType.key,
                          parseInt(event.target.value, 10)
                        );
                        onOptionDropdownChange(
                          member.key,
                          attributeType.key,
                          parseInt(event.target.value, 10)
                        );
                      }}
                    >
                      {attributeType.optionList.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={"sm:px-4 min-w-full"}>
        <button
          className={
            "hover:bg-sky-50 min-w-full text-center mt-2 p-2 rounded-md font-medium text-gray-600 text-md px-4 flex flex-row justify-center"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m6-6H6"
            />{" "}
          </svg>
          <p>Add new member</p>
        </button>
      </div>
    </div>
  );
};

export default MemberTable;
