import React from "react";
import { Member } from "@/lib/types";

interface Props {
  memberSize: number;
  groupSize: number;
  onNumberChange: (input: number) => void;
}

const GroupingSetup: React.FC<Props> = ({
  memberSize,
  groupSize,
  onNumberChange,
}) => {
  return (
    <div className={"mb-2 text-center sm:text-left"}>
      <span className={"font-semibold text-gray-600 "}>
        We will group total <u className={"font-bold"}>{memberSize}</u> members
        into{" "}
      </span>
      <input
        type="number"
        className={"w-20 border"}
        value={groupSize}
        onChange={(event) => {
          onNumberChange(Number(event.target.value));
        }}
      />
      <span> groups</span>
    </div>
  );
};

export default GroupingSetup;
