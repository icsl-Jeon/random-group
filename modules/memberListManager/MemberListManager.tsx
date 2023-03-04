import React from "react";
import { AttributeType, Member, Option } from "@/lib/types";
import MemberTable from "./MemberTable";

interface Props {
  memberList: Array<Member>;
  attributeTypeList: Array<AttributeType>;
  onRandomMemberAdd: () => void;
  onOptionChange: (
    memberKey: number,
    attributeTypeKey: number,
    optionKey: number
  ) => void;
  onMemberRemove: (memberKey: number) => void;
}

const MemberListManager: React.FC<Props> = ({
  memberList,
  attributeTypeList,
  onRandomMemberAdd,
  onOptionChange,
  onMemberRemove,
}) => {
  return (
    <div className={"px-1"}>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-2 sm:mt-5">
        <p className="font-semibold  text-gray-600 ">
          Add, delete, modify member list.
        </p>
        <button
          className={
            "bg-sky-500 hover:bg-sky-600 text-center m-2 sm:m-0 p-2 rounded-lg font-medium text-white px-4 flex flex-row justify-center"
          }
          onClick={onRandomMemberAdd}
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
          <p>New member</p>
        </button>
      </div>
      <div className={"px-1"}>
        <MemberTable
          members={memberList}
          attributeTypes={attributeTypeList}
          onOptionDropdownChange={onOptionChange}
          onMemberRemove={onMemberRemove}
        />
      </div>
    </div>
  );
};

export default MemberListManager;