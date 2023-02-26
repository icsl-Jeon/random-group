import React, { useState, useEffect, useRef } from "react";

import { Option } from "@/lib/types";

interface AddProps {
  onItemAdd: (name: string) => void; // key should be assigned from external
}

export const ListAdder: React.FC<AddProps> = ({ onItemAdd }) => {
  const [newItemName, setNewItemName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const handleNewItemNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItemName(e.target.value);
  };

  const handleAddItem = () => {
    onItemAdd(newItemName);
    handleAddCancel();
  };
  const handleAddCancel = () => {
    setIsAdding(false);
    setNewItemName("");
  };

  useEffect(() => {
    // console.log(isAdding);
    // addButtonRef.current?.focus();
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleAddCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={"ml-2 w-full py-1.5 text-slate-300"}>
      {" "}
      {!isAdding && (
        <button
          className={"w-full text-left text-inherit hover:bg-slate-50"}
          ref={addButtonRef}
          onClick={() => {
            setIsAdding(true);
          }}
        >
          <span className={""}> Add option ..</span>
        </button>
      )}{" "}
      {isAdding && (
        <div>
          <input
            placeholder="Enter new option"
            value={newItemName}
            onChange={handleNewItemNameChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                if (newItemName) handleAddItem();
              }
              if (event.key === "Escape") {
                handleAddCancel();
              }
            }}
            className="rounded-md border px-2 text-gray-500"
          />
        </div>
      )}
    </div>
  );
};

interface Props {
  items: Option[];
  onItemUpdate: (updatedItem: Option) => void;
  onItemRemove: (key: number) => void;
  onItemAdd: (name: string) => void; // key should be assigned from external
}

const OptionList: React.FC<Props> = ({
  items,
  onItemUpdate,
  onItemRemove,
  onItemAdd,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");

  const cancelEdit = () => {
    setEditingId(null);
    setEditedValue("");
  };

  const handleClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (editingId && !target.closest(`#item-${editingId}`)) {
      cancelEdit();
    }
  };

  const startEdit = (itemId: number, name: string) => {
    console.log("editing", itemId);
    setEditingId(itemId);
    setEditedValue(name);
  };

  return (
    <ul className="rounded-md text-sm" onClick={handleClick}>
      {items.map((item) => (
        <li
          key={item.key}
          id={`item-${item.key}`}
          // onDoubleClick={() => startEdit(item.key, item.name)}
          className="my-1 text-gray-500"
        >
          {editingId === item.key ? (
            <input
              value={editedValue}
              className="focus:shadow-outline appearance-none rounded border bg-inherit	px-2 py-1 leading-tight text-gray-700 outline-none"
              onChange={(event) => setEditedValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onItemUpdate({ key: item.key, name: editedValue });
                  cancelEdit();
                } else if (event.key === "Escape") {
                  cancelEdit();
                }
              }}
            />
          ) : (
            <span className="align-center flex px-2 ">
              <span>{item.name}</span>

              <button
                className="ml-2 mr-1 rounded-full opacity-50 hover:opacity-100"
                onClick={() => {
                  startEdit(item.key, item.name);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3 w-3"
                >
                  <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                </svg>
              </button>

              <button
                onClick={() => onItemRemove(item.key)}
                className="opacity-50 hover:opacity-100 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
          )}
        </li>
      ))}
      <li className={""}>
        <ListAdder onItemAdd={onItemAdd} />
      </li>
    </ul>
  );
};

OptionList.displayName = "List";
ListAdder.displayName = "ListAdder";
export default OptionList;
