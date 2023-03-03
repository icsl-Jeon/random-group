import Head from "next/head";
import Accordion from "@/components/Accordion";
import React, { useState, useRef, useEffect } from "react";
import { initialAttributeTypeList, initialMemberList } from "@/lib/initials";
import { AttributeType, Member } from "@/lib/types";
import MemberTable from "@/components/MemberTable";
import EditPortal from "@/template/EditPortal";
import CreatePortal from "@/template/CreatePortal";
import {
  generateRandomMemberList,
  addAttribute,
  removeAttribute,
} from "@/lib/utility";
import Swal from "sweetalert2";

export default function Home() {
  const newKey = useRef(2);
  const [attributeTypeList, setAttributeTypeList] = useState<AttributeType[]>(
    initialAttributeTypeList
  );

  // Attribute type handlers
  const handleAttributeTypeUpdate = (newAttributeType: AttributeType) => {
    const result = attributeTypeList.find(
      (item) => item.key === newAttributeType.key
    );
    if (result) {
      // updating

      setAttributeTypeList((previousAttributeTypeList) => {
        const updatedAttributeTypeList = previousAttributeTypeList.map(
          (item) => {
            if (item.key === newAttributeType.key) {
              return newAttributeType;
            }
            return item;
          }
        );
        return updatedAttributeTypeList;
      });
    } else {
      // adding
      setAttributeTypeList([
        ...attributeTypeList,
        { ...newAttributeType, key: newKey.current },
      ]);
      newKey.current++;
    }
  };

  const handleAttributeTypeToggle = (key: number) => {
    const attribute = attributeTypeList.find((item) => {
      return item.key === key;
    });
    if (!attribute) {
      console.warn("Trying an invalid key when toggling.");
      return;
    }

    if (attribute.isAppliedToMemberList) {
      Swal.fire({
        title: "Delete attribute",
        text: "Are you sure you want to delete this attribute? The column corresponding this attribute will be deleted from the member list.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "red",
        cancelButtonColor: "slate",
      })
        .then((result) => {
          if (result.isConfirmed) {
            // User clicked OK
            // Perform the member deletion

            setMemberList(
              memberList.map((member) => removeAttribute(member, attribute.key))
            );
            const newAttributeTypeList = attributeTypeList.map((item) => {
              if (item.key === key) {
                return {
                  ...item,
                  isAppliedToMemberList: false,
                };
              } else {
                return item;
              }
            });
            setAttributeTypeList(newAttributeTypeList);
          }
        })
        .catch(() => {});
    }

    if (!attribute.isAppliedToMemberList) {
      setMemberList(
        memberList.map((member) => addAttribute(member, attribute))
      );

      const newAttributeTypeList = attributeTypeList.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            isAppliedToMemberList: true,
          };
        } else {
          return item;
        }
      });
      setAttributeTypeList(newAttributeTypeList);
    }
  };

  const [memberList, setMemberList] = useState<Member[]>([]);

  useEffect(() => {
    setMemberList(generateRandomMemberList(attributeTypeList, 3));
  }, []);

  // Member handlers
  const handleOptionChange = (
    updatedMemberKey: number,
    attributeTypeKey: number,
    attributeValueKey: number
  ) => {
    const newMemberList = memberList.map((member) =>
      member.key === updatedMemberKey
        ? {
            ...member,
            attributeList: member.attributeList.map((attribute) =>
              attribute.attributeTypeKey === attributeTypeKey
                ? {
                    ...attribute,
                    attributeTypeValue:
                      initialAttributeTypeList[attributeTypeKey].optionList[
                        attributeValueKey
                      ],
                  }
                : attribute
            ),
          }
        : member
    );
    setMemberList(newMemberList);
  };

  const handleMemberRemove = (removedMemberKey: number) => {
    setMemberList(
      memberList.filter((member) => {
        return member.key !== removedMemberKey;
      })
    );
  };

  const handleRandomMemberAdd = () => {
    // Find all the toggled attribute type list
  };

  return (
    <>
      <Head>
        <title>Diverse group generator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="icon" href="/favicon.ico" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6825630715558369"
          crossOrigin="anonymous"
        ></script>
      </Head>

      <div className="mx-auto max-w-screen-lg">
        <h1 className="mx-auto py-5 px-2 text-center  font-sans text-3xl font-bold text-gray-600 sm:text-left">
          Diverse group generator
        </h1>
        <Accordion
          title="1. Register members to be grouped"
          isInitialOpen={true}
        >
          <div className={"p-4 "}>
            <p className="font-semibold mb-2 text-gray-600">
              Toggle attributes to build member list.
            </p>

            <div className="flex sm:px-3 flex-wrap rounded-lg p-3">
              {attributeTypeList.map((item) => {
                return (
                  <EditPortal
                    key={item.key}
                    attributeType={item}
                    onAttributeTypeUpdate={handleAttributeTypeUpdate}
                    onToggle={handleAttributeTypeToggle}
                  />
                );
              })}
              <CreatePortal
                onAttributeTypeAdd={handleAttributeTypeUpdate}
              ></CreatePortal>
            </div>

            <div
              className={
                "flex flex-col sm:flex-row justify-between items-center mt-2 sm:mt-5"
              }
            >
              <p className="font-semibold  text-gray-600 ">
                Add, delete, modify member list.
              </p>
              <button
                className={
                  "bg-sky-500 hover:bg-sky-600 text-center m-2 sm:m-0 p-2 rounded-lg font-medium text-white px-4 flex flex-row justify-center"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />{" "}
                </svg>
                <p>New member</p>
              </button>
            </div>
            <div className={"px-1"}>
              <MemberTable
                members={memberList}
                attributeTypes={attributeTypeList}
                onOptionDropdownChange={handleOptionChange}
                onMemberRemove={handleMemberRemove}
              />
            </div>
          </div>
        </Accordion>
        <Accordion title="2. Grouping setup" isInitialOpen={false}>
          <div>My name</div>
        </Accordion>
      </div>
    </>
  );
}
