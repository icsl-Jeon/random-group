import React from "react";
import EditPortal from "@/modules/attributeTypeManager/EditPortal";
import CreatePortal from "@/modules/attributeTypeManager/CreatePortal";
import { AttributeType } from "@/lib/types";

interface Props {
  attributeTypeList: AttributeType[];
  onAttributeTypeUpdate: (attributeType: AttributeType) => void;
  onAttributeTypeToggle: (key: number) => void;
}

const AttributeTypeManager: React.FC<Props> = ({
  attributeTypeList,
  onAttributeTypeUpdate,
  onAttributeTypeToggle,
}) => {
  return (
    <div>
      <p className="font-semibold mb-2 text-gray-600 sm:text-left text-center">
        Toggle attributes to build member list.
      </p>

      <div className="flex sm:px-3 flex-wrap rounded-lg p-3 items-center">
        {attributeTypeList.map((item) => {
          return (
            <EditPortal
              key={item.key}
              attributeType={item}
              onAttributeTypeUpdate={onAttributeTypeUpdate}
              onToggle={onAttributeTypeToggle}
            />
          );
        })}
        <CreatePortal onAttributeTypeAdd={onAttributeTypeUpdate} />
      </div>
    </div>
  );
};

export default AttributeTypeManager;
