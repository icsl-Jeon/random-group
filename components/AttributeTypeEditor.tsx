import React, { useState, useCallback, useRef } from "react";
import { AttributeType, Option } from "@/lib/types";
import OptionList from "@/components/OptionList";

interface Props {
  initialAttributeType: AttributeType;
  toggleModal: () => void;
}

const AttributeTypeEditor = ({ initialAttributeType, toggleModal }: Props) => {
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

  const handleUpdateButtonClick = (event: React.MouseEvent) => {};

  return (
    <div className="flex flex-col ">
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

      {attributeName && optionList.length >= 2 && (
        <div className="py-3 sm:flex sm:flex-row-reverse justify-center mt-5">
          <button
            onClick={(event: React.MouseEvent) => {
              handleUpdateButtonClick(event);
            }}
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-sky-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-bluw-500 focus:ring-offset-2 sm:ml-3 sm:mr-3 sm:w-auto sm:text-sm"
          >
            Done
          </button>

          <button
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={toggleModal}
          >
            {" "}
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AttributeTypeEditor;
