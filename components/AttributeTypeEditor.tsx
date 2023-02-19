import React, { useState, useCallback, useRef } from "react";
import { AttributeType, Option } from "@/lib/types";
import OptionList from "@/components/OptionList";

interface Props {
  initialAttributeType: AttributeType;
}

const AttributeTypeEditor = ({ initialAttributeType }: Props) => {
  const [attributeName, setAttributeName] = useState<string>(
    initialAttributeType.name
  );
  const [optionList, setOptionList] = useState<Option[]>(
    initialAttributeType.optionList
  );
  const newOptionId = useRef(initialAttributeType.newOptionKey);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAttributeName(e.target.value);
    },
    []
  );

  const handleOptionUpdate = useCallback((updatedOption: Option) => {
    setOptionList((prevItems) => {
      // key cannot be changed. Only name is changed
      const updatedItems = prevItems.map((item) => {
        if (item.key === updatedOption.key) {
          return { ...item, name: updatedOption.name };
        }
        return item;
      });
      return updatedItems;
    });
  }, []);
  const handleOptionAdd = useCallback(
    (addedOptionName: string) => {
      setOptionList([
        ...optionList,
        { key: newOptionId.current, name: addedOptionName },
      ]);
      newOptionId.current += 1;
    },
    [optionList]
  );
  const handleOptionRemove = useCallback((removedOptionId: number) => {
    setOptionList((prevItems) => {
      return prevItems.filter((item) => item.key !== removedOptionId);
    });
  }, []);

  return (
    <div className="flex flex-col items-start ">
      <label className="block text-gray-700 text-sm font-bold mb-2 ">
        <p className="text-left">Attribute name</p>
      </label>
      <input
        type="text"
        placeholder="Please enter attribute name... "
        className="appearance-none border-b  rounded w-full py-2 px-1 text-gray-700 mb-3 leading-tight outline-none focus:shadow-outline"
        onChange={handleInputChange}
        value={attributeName}
      />
      <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
        <p className="text-left">List of options</p>
      </label>
      <OptionList
        items={optionList}
        onItemRemove={handleOptionRemove}
        onItemUpdate={handleOptionUpdate}
        onItemAdd={handleOptionAdd}
      ></OptionList>
    </div>
  );
};

export default AttributeTypeEditor;
