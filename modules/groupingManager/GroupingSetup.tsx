import React from "react";
import { AttributeType, Member } from "@/lib/types";

interface Props {
  memberSize: number;
  groupSize: number;
  onNumberChange: (input: number) => void;
  attributeTypeList: AttributeType[];
  onAttributeTypeUpdate: (attributeType: AttributeType) => void;
}

const GroupingSetup: React.FC<Props> = ({
  memberSize,
  groupSize,
  onNumberChange,
  attributeTypeList,
  onAttributeTypeUpdate,
}) => {
  const handleNoneClick = () => {
    const strictIndex = attributeTypeList.findIndex((item) => item.isStrict);
    if (strictIndex >= 0) {
      const strictAttributeType = attributeTypeList[strictIndex];
      onAttributeTypeUpdate({ ...strictAttributeType, isStrict: false });
    }
  };

  const handleChipClick = (attributeType: AttributeType) => {
    if (attributeType.isStrict) return;

    const prevStrictIndex = attributeTypeList.findIndex(
      (item) => item.isStrict
    );
    if (prevStrictIndex >= 0) {
      const strictAttributeType = attributeTypeList[prevStrictIndex];
      onAttributeTypeUpdate({ ...strictAttributeType, isStrict: false });
    }

    onAttributeTypeUpdate({ ...attributeType, isStrict: true });
  };

  return (
    <div className={" text-center  sm:text-left"}>
      <ul className={"text-gray-600 "}>
        <li className={"mb-8 "}>
          <div className={"font-semibold mb-4"}>
            Select a number of groups (should be larger than {1} and smaller
            than {memberSize})
          </div>
          <input
            type="number"
            className={"w-10 border-b ml-4"}
            value={groupSize}
            onChange={(event) => {
              onNumberChange(
                Math.max(
                  Math.min(Number(event.target.value), memberSize - 1),
                  2
                )
              );
            }}
          />
          <span className={"text-gray-600"}> groups </span>
        </li>
        <li>
          <div className={"text-gray-600 font-semibold mb-4"}>
            Select an attribute to be strictly diverse.
          </div>
          <div className={"flex flex-row sm:px-3 "}>
            <div
              className={`${
                attributeTypeList.findIndex((item) => item.isStrict) < 0
                  ? "bg-sky-300"
                  : "bg-slate-100"
              } border border-sky-500  active:bg-sky-300  text-gray-600 align-center ease relative mx-1 my-2 flex w-max cursor-pointer rounded-full text-sm text-gray-600 transition transition duration-300 duration-300	`}
            >
              <span className={`flex items-center p-2 sm:text-sm `}>
                <span className="" onClick={handleNoneClick}>
                  None
                </span>
              </span>
            </div>

            {attributeTypeList.map((attributeType, index) => {
              const color = attributeType.isStrict
                ? "bg-sky-300"
                : "bg-slate-100";
              if (attributeType.isAppliedToMemberList)
                return (
                  <div
                    className={` ${color} border border-sky-500  active:bg-sky-300 text-gray-600 align-center ease relative mx-1 my-2 flex w-max cursor-pointer rounded-full text-sm text-gray-600 transition transition duration-300 duration-300	`}
                    key={index}
                    onClick={() => handleChipClick(attributeType)}
                  >
                    <span className="flex items-center p-2 sm:text-sm">
                      <span className="">{attributeType.name}</span>
                    </span>
                  </div>
                );
            })}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default GroupingSetup;
