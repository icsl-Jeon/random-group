import Head from "next/head";
import Script from "next/script";
import Accordion from "@/layout/Accordion";
import React, { useState, useRef, useEffect } from "react";
import { initialAttributeTypeList } from "@/lib/initials";
import { AttributeType, Member } from "@/lib/types";
import {
  generateRandomMemberList,
  addAttribute,
  removeAttribute,
  generateRandomMember,
  computeStatistics,
} from "@/lib/utility";
import Swal from "sweetalert2";
import AttributeTypeManager from "@/modules/attributeTypeManager/AttributeTypeManager";
import MemberListManager from "@/modules/memberListManager/MemberListManager";
import GroupingSetup from "@/modules/groupingManager/GroupingSetup";
import GroupingResult from "@/modules/groupingResultManager/GroupingResult";
import GroupingManager from "@/modules/groupingManager/GroupingManager";

export default function Home() {
  // Attribute type handlers

  const newAttributeKey = useRef(2);
  const [attributeTypeList, setAttributeTypeList] = useState<AttributeType[]>(
    initialAttributeTypeList
  );

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
        { ...newAttributeType, key: newAttributeKey.current },
      ]);
      newAttributeKey.current++;
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
  const initialMemberLength = 8;
  useEffect(() => {
    if (memberList.length === 0) {
      const initialMemberList = generateRandomMemberList(
        attributeTypeList,
        initialMemberLength
      );

      setMemberList(initialMemberList);
    }
  }, [attributeTypeList]);
  const newMemberKey = useRef(initialMemberLength);

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
    const appliedAttributeList = attributeTypeList.filter((attribute) => {
      return attribute.isAppliedToMemberList;
    });
    setMemberList([
      ...memberList,
      generateRandomMember(appliedAttributeList, memberList.length),
    ]);
    newMemberKey.current += 1;
  };

  // grouping setup

  const [numGroups, setNumGroups] = useState(3);

  // grouping result
  const [groupingResult, setGroupingResult] = useState<number[][]>([]);

  return (
    <>
      <Head>
        <title>Diverse group generator</title>
        <meta
          name="description"
          content="We split a given number of members into balanced groups in terms of a set attributes.
           The attributes are fully customizable by adding attributes and option list for an attribute. "
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="icon" href="/favicon.ico" />

        <Script
          id="Adsense-id"
          data-ad-client="ca-pub-6825630715558369"
          async
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          onError={(e) => {
            console.error("Script failed to load", e);
          }}
        />
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
            <AttributeTypeManager
              attributeTypeList={attributeTypeList}
              onAttributeTypeUpdate={handleAttributeTypeUpdate}
              onAttributeTypeToggle={handleAttributeTypeToggle}
            />
            <MemberListManager
              memberList={memberList}
              attributeTypeList={attributeTypeList}
              onRandomMemberAdd={handleRandomMemberAdd}
              onOptionChange={handleOptionChange}
              onMemberRemove={handleMemberRemove}
            />
          </div>
        </Accordion>
        <Accordion title="2. Grouping setup" isInitialOpen={true}>
          <div className={"p-4"}>
            {" "}
            <GroupingManager
              groupSize={numGroups}
              memberList={memberList}
              onNumberChange={setNumGroups}
              attributeTypeList={attributeTypeList}
              onAttributeTypeUpdate={handleAttributeTypeUpdate}
              setGroupingResult={setGroupingResult}
            ></GroupingManager>
          </div>
        </Accordion>
        <Accordion title="3. Grouping result" isInitialOpen={true}>
          <div className={"p-4"}>
            {" "}
            <GroupingResult
              members={memberList}
              attributeTypes={attributeTypeList}
              groupingResult={groupingResult}
            />
          </div>
        </Accordion>
      </div>
    </>
  );
}
