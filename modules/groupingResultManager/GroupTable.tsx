import React, { useState, useEffect, useRef } from "react";
import { Member, AttributeType, Statistics } from "@/lib/types";
import { computeStatistics } from "@/lib/utility";

interface Props {
  members: Member[];
  attributeTypes: AttributeType[];
}

const GroupTable: React.FC<Props> = ({ members, attributeTypes }) => {
  const [statistics, setStatistics] = useState<Statistics>(() => ({
    attributeStatisticsList: computeStatistics(attributeTypes, members),
  }));

  useEffect(() => {
    setStatistics({
      attributeStatisticsList: computeStatistics(attributeTypes, members),
    });
  }, [attributeTypes, members]);

  return (
    <div className="sm:p-2 flex flex-col items-center ">
      <table className="border-collapse table-auto w-full text-left">
        <thead className="border-b text-sm sm:text-md">
          <tr className="">
            <th className="px-2 sm:px-4 py-2  ">Member id</th>
            {attributeTypes.map((attributeType, index) => {
              if (attributeType.isAppliedToMemberList)
                return (
                  <th className="px-2 sm:px-2 py-2 " key={index}>
                    {attributeType.name}
                  </th>
                );
            })}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.key} className="text-sm ">
              <td className="px-4 py-2 flex">{member.key}</td>
              {attributeTypes.map((attributeType) => {
                if (!attributeType.isAppliedToMemberList) return;
                const attribute = member.attributeList.find(
                  (attr) => attr.attributeTypeKey === attributeType.key
                );
                if (!attribute) return;

                const selectedOptionId = attribute.attributeTypeValue.key;

                return (
                  <td key={attributeType.key} className=" px-2 py-2 text-sm">
                    {attributeType.optionList[selectedOptionId].name}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr key={members.length} className={"text-sm border-t"}>
            <td className={"px-4 py-2 font-bold"}></td>
            {attributeTypes.map((attributeType, index) => {
              return (
                <td key={attributeType.key} className={"px-2 py-2 "}>
                  {attributeType.optionList.map((option, index_inner) => {
                    if (!attributeType.isAppliedToMemberList) return;

                    const attributeIndex =
                      statistics.attributeStatisticsList.findIndex(
                        (item) => item.key === attributeType.key
                      );
                    if (attributeIndex < 0) return;

                    const optionIndex = statistics.attributeStatisticsList[
                      attributeIndex
                    ].optionCountList.findIndex(
                      (item) => item.key === option.key
                    );
                    const count =
                      statistics.attributeStatisticsList[attributeIndex]
                        .optionCountList[optionIndex].count;

                    return (
                      <div key={index_inner} className=" py-1 sm:py-2">
                        <div>
                          {option.name} : {count}{" "}
                        </div>
                        <span className={"hidden sm:inline"}>
                          ({Math.floor((100 * count) / members.length)}%)
                        </span>
                      </div>
                    );
                  })}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default GroupTable;
