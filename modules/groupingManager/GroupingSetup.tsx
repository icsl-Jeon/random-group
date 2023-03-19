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
          <div className="flex mx-auto sm:mx-5 justify-center sm:justify-start">
            <button
              className="bg-slate-200 hover:bg-slate-300"
              onClick={() => {
                return onNumberChange(Math.max(groupSize - 1, 2));
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className="px-3 bg-slate-50 text-gray-400">{groupSize}</span>
            <button
              className="bg-slate-200 hover:bg-slate-300"
              onClick={() => {
                return onNumberChange(Math.min(groupSize + 1, memberSize - 1));
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
            </button>
            <span className={"ml-2 text-gray-500"}> groups </span>
          </div>
          {/* 
          <input
            type="number"
            className={"w-10 border-b ml-4"}
            value={groupSize}
            onKeyDown={() => {
              return false;
            }}
            step={1}
            min={2}
            max={memberSize - 1}
            onChange={(event) => {
              console.log(event.target.value);
              onNumberChange(Number(event.target.value));
            }}
          /> */}
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
