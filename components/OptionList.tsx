import React, { useState, useEffect, useRef } from "react";

import { Option } from "@/lib/types";

interface AddProps {
  onItemAdd: (name: string) => void; // key should be assigned from external
}

export const ListAdder: React.FC<AddProps> = React.memo(({ onItemAdd }) => {
  const [newItemName, setNewItemName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const handleNewItemNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItemName(e.target.value);
  };

  const handleAddItem = () => {
    onItemAdd(newItemName);
    setIsAdding(false);
    setNewItemName("");
    if (addButtonRef.current) {
      addButtonRef.current.focus();
    }
  };
  const handleAddCancel = () => {
    setIsAdding(false);
    setNewItemName("");
  };

  useEffect(() => {
    addButtonRef.current?.focus();
  });

  useEffect(() => {
    console.log("Rerender List Adder!");
  });

  return (
    <div className={"py-1.5 ml-2 text-slate-300 w-full"}>
      {" "}
      {!isAdding && (
        <button
          className={"text-inherit hover:bg-slate-50 w-full text-left"}
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
                handleAddCancel();
              }
              if (event.key === "Escape") {
                handleAddCancel();
              }
            }}
            className="border px-2 text-gray-500 rounded-md"
          />
        </div>
      )}
    </div>
  );
});

interface Props {
  items: Option[];
  onItemUpdate: (updatedItem: Option) => void;
  onItemRemove: (key: number) => void;
  onItemAdd: (name: string) => void; // key should be assigned from external
}

const OptionList: React.FC<Props> = React.memo(
  ({ items, onItemUpdate, onItemRemove, onItemAdd }) => {
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
      <ul
        className="grid grid-cols-1 rounded-md  w-full text-sm"
        onClick={handleClick}
      >
        {items.map((item) => (
          <li
            key={item.key}
            id={`item-${item.key}`}
            onDoubleClick={() => startEdit(item.key, item.name)}
            className="mt-1 mb-1  text-gray-500"
          >
            {editingId === item.key ? (
              <input
                value={editedValue}
                className="appearance-none border rounded px-2 py-1 bg-inherit	 text-gray-700 leading-tight outline-none focus:shadow-outline border-slate-300"
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
              <span className="flex align-center px-2 py-1">
                <span>{item.name}</span>

                <button onClick={() => onItemRemove(item.key)} className="ml-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-3 h-6"
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
  }
);

OptionList.displayName = "List";
ListAdder.displayName = "ListAdder";
export default OptionList;
