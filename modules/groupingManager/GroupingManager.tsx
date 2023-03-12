import { AttributeType } from "@/lib/types";
import React from "react";
import GroupingSetup from "@/modules/groupingManager/GroupingSetup";
interface Props {
  memberSize: number;
  groupSize: number;
  onNumberChange: (input: number) => void;
  attributeTypeList: AttributeType[];
  onAttributeTypeUpdate: (attributeType: AttributeType) => void;
}

const GroupingManager: React.FC<Props> = ({
  memberSize,
  groupSize,
  onNumberChange,
  attributeTypeList,
  onAttributeTypeUpdate,
}) => {
  return (
    <div>
      <GroupingSetup
        memberSize={memberSize}
        groupSize={groupSize}
        onNumberChange={onNumberChange}
        attributeTypeList={attributeTypeList}
        onAttributeTypeUpdate={onAttributeTypeUpdate}
      />
      <div className={"flex flex-col items-center border-t mt-6"}>
        <div
          className={`flex items-center px-4 py-3 mt-6 sm:py-2 mx-1 relative transition duration-300 hover:bg-sky-600 rounded-full text-gray-500 bg-sky-500 text-sm flex align-center cursor-pointer transition duration-300 ease w-max	my-2`}
        >
          <div className=" text-white text-lg">Perform grouping !</div>
        </div>
      </div>
    </div>
  );
};

export default GroupingManager;
