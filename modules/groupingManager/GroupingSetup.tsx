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
    <div>
      <span>Group total {memberSize} members into </span>
      <input
        type="number"
        className={"border"}
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
