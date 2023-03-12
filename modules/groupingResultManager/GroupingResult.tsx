import React, { useState, useRef, useEffect } from "react";
import { Member, AttributeType } from "@/lib/types";
import GroupTable from "@/modules/groupingResultManager/GroupTable";
interface Props {
  members: Member[];
  attributeTypes: AttributeType[];
  groupingResult: number[][];
}

const GroupingResult: React.FC<Props> = ({
  members,
  attributeTypes,
  groupingResult,
}) => {
  return (
    <div>
      {groupingResult.length === 0 ? (
        <span className={"text-gray-500 text-lg"}>
          Still no result :( <br /> Press the above button 👆
        </span>
      ) : (
        groupingResult.map((memberKeyList, index) => {
          return (
            <div
              key={index}
              className={"mt-2 mb-4 sm:m-3 sm:mb-6  rounded-t-2xl shadow-md"}
            >
              <div
                className={
                  "text-gray-500 font-semibold p-2 sm:p-4 rounded-t-2xl text-center sm:text-left bg-gray-50"
                }
              >
                Group {index + 1}
              </div>
              <GroupTable
                members={memberKeyList.map((key) => members[key])}
                attributeTypes={attributeTypes}
              ></GroupTable>
            </div>
          );
        })
      )}
    </div>
  );
};

export default GroupingResult;
