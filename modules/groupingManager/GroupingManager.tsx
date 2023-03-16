import { AttributeType, Member } from "@/lib/types";
import React from "react";
import GroupingSetup from "@/modules/groupingManager/GroupingSetup";
import { performGrouping } from "@/lib/utility";
interface Props {
  memberList: Member[];
  groupSize: number;
  onNumberChange: (input: number) => void;
  attributeTypeList: AttributeType[];
  onAttributeTypeUpdate: (attributeType: AttributeType) => void;
  setGroupingResult: (groupingResult: number[][]) => void;
}

const GroupingManager: React.FC<Props> = ({
  memberList,
  groupSize,
  onNumberChange,
  attributeTypeList,
  onAttributeTypeUpdate,
  setGroupingResult,
}) => {
  return (
    <div>
      <GroupingSetup
        memberSize={memberList.length}
        groupSize={groupSize}
        onNumberChange={onNumberChange}
        attributeTypeList={attributeTypeList}
        onAttributeTypeUpdate={onAttributeTypeUpdate}
      />
      <div className={"flex flex-col items-center border-t mt-6"}>
        <div
          className={` shadow-md
           flex items-center px-4 py-3 mt-6 sm:py-2 mx-1 relative transition duration-300 hover:bg-sky-600 rounded-full text-gray-500 bg-sky-500 text-sm flex align-center cursor-pointer transition duration-300 ease w-max	my-2`}
        >
          <div
            className=" text-white text-lg"
            onClick={() => {
              setGroupingResult(
                performGrouping(attributeTypeList, memberList, groupSize)
              );
            }}
          >
            Perform grouping !
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupingManager;
