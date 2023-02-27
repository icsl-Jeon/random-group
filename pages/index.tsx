import Head from "next/head";
import Accordion from "@/components/Accordion";
import { useState, useRef, useEffect } from "react";
import { initialAttributeTypeList, initialMemberList } from "@/lib/initials";
import { AttributeType, Member } from "@/lib/types";
import MemberTable from "@/components/MemberTable";
import EditPortal from "@/template/EditPortal";
import CreatePortal from "@/template/CreatePortal";
import { generateRandomMemberList } from "@/lib/utility";

export default function Home() {
  const newKey = useRef(2);
  const [attributeTypeList, setAttributeTypeList] = useState<AttributeType[]>(
    initialAttributeTypeList
  );
  const handleAttributeTypeUpdate = (newAttributeType: AttributeType) => {
    const result = attributeTypeList.find(
      (item) => item.key === newAttributeType.key
    );
    // console.log(newAttributeType)
    if (result) {
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
      setAttributeTypeList([
        ...attributeTypeList,
        { ...newAttributeType, key: newKey.current },
      ]);
      newKey.current++;
    }
  };

  const [memberList, setMemberList] = useState<Member[]>([]);

  useEffect(() => {
    setMemberList(generateRandomMemberList(attributeTypeList, 3));
  }, []);

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
        <Accordion title="1. Register members to be grouped">
          <div className={"p-4"}>
            <p className="font-semibold mb-2 text-gray-600">
              Toggle attributes to build member list 😊
            </p>

            <div className="flex sm:px-3 flex-wrap">
              {attributeTypeList.map((item) => {
                return (
                  <EditPortal
                    key={item.key}
                    attributeType={item}
                    onAttributeTypeUpdate={handleAttributeTypeUpdate}
                  />
                );
              })}
              <CreatePortal
                onAttributeTypeAdd={handleAttributeTypeUpdate}
              ></CreatePortal>
            </div>
            <p className="font-semibold mb-2 mt-5 text-gray-600 ">
              Create, delete, modify member list 😆
            </p>
            <div className={"px-3"}>
              <MemberTable
                members={memberList}
                attributeTypes={initialAttributeTypeList}
                onOptionDropdownChange={handleOptionChange}
              />
            </div>
          </div>
        </Accordion>
        <Accordion title="2. Grouping setup">
          <div>My name</div>
        </Accordion>
      </div>
    </>
  );
}
