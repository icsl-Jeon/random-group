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
import thumbnail from "@/public/image1.png";
import Image from "next/image";
import Swal from "sweetalert2";
import AttributeTypeManager from "@/modules/attributeTypeManager/AttributeTypeManager";
import MemberListManager from "@/modules/memberListManager/MemberListManager";
import GroupingSetup from "@/modules/groupingManager/GroupingSetup";
import GroupingResult from "@/modules/groupingResultManager/GroupingResult";
import GroupingManager from "@/modules/groupingManager/GroupingManager";
import Link from "next/link";
import EditPortal from "@/modules/attributeTypeManager/EditPortal";

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
        <title>Balanced group generator</title>
        <meta
          name="description"
          content="This web application divides a number of members into groups, so that each group have a balanced distribution regarding on multiple attributes simultaneously.

          What makes our tool different from others is that there is few online tool which can take multiple attributes into considerations. For example, a teacher wants to make students' groups where each group has almost equal sex ratio while average scores are well distributed across groups. Finding an optimal balance might be challenging even for a human.
          
          This online tool finds a balanced grouping with respect to multiple attributes by running an optimization, where its objective is to make the distribution of each group as similar as possible with the whole members' distribution. "
        />
        <meta
          name="keywords"
          content="Random group generation, balanced grouping, diversity group generation, Genetic algorithm"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Balanced group generator" />
        <meta
          property="og:url"
          content="https://diverse-group-generation.vercel.app/"
        />
        <meta property="author" content="Dr. boseong Jeon" />

        <link rel="icon" href="/favicon.png" />

        <Script
          id="Adsense-id"
          async
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6825630715558369"
          onError={(e) => {
            console.error("Script failed to load", e);
          }}
        />
      </Head>

      <div className="mx-auto max-w-screen-lg ">
        {/* <div className="flex flex-col items-center sm:flex-row-reverse p-2">
          <div className=" font-semilight text-gray-600 ml-4 hover:bg-slate-100 rounded-md  ">
            <Link href={"/posts/tutorial"}>
              {" "}
              <div className="  duration-300 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                  <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                </svg>
                <span className="ml-1">Read docs</span>
              </div>
            </Link>
          </div>
        </div> */}
        <div className="mx-3 sm:mx-0 flex flex-col items-center sm:items-start bg-gradient-to-br from-indigo-100  via-slate-50 via-slate-100 to-sky-100 pt-24 sm:pt-40 pb-10 my-3 rounded-xl">
          <h1 className="mx-auto sm:ml-3 pt-5 px-3 sm:px-10 text-center  font-sans text-3xl font-bold text-black sm:text-left">
            Balanced group generator
          </h1>
        </div>

        <Accordion title="Overview and feature" isInitialOpen={true}>
          <section className="mx-auto px-3 my-2 sm:my-10 font-light">
            <p className="mx-3 text-base   my-2">
              {" "}
              This web application divides a number of members into groups, so
              that each group have a balanced distribution regarding on{" "}
              <u>multiple attributes simultaneously</u>.{" "}
            </p>
            <p className="mx-3 text-base   my-2">
              What makes our tool different from others is that there is few
              online tool which can take multiple attributes into
              considerations. For example, a teacher wants to make students'
              groups where each group has almost equal sex ratio while average
              scores are well distributed across groups. Finding an optimal
              balance might be challenging even for a human.
            </p>
            <p className="mx-3 text-base   my-2">
              This online tool finds a balanced grouping with respect to
              multiple attributes by running an optimization, where its
              objective is to make the distribution of each group as similar as
              possible with the whole members' distribution. For more detailed
              usage,{" "}
              <a href="#detail" className="text-sky-500">
                click here 🤖
              </a>
            </p>
          </section>
        </Accordion>

        <Accordion
          title="1. Register members to be grouped"
          isInitialOpen={true}
        >
          <div className={"p-2 sm:p-4 "}>
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
        <section
          id="detail"
          className="focus:outline-none focus:shadow-lg mx-auto px-3 my-4 sm:my-10"
        >
          <h2 className="text-2xl text-gray-600 mb-3">
            {" "}
            How to use this web application🤨
          </h2>
          <h3 className="text-xl  text-gray-8s00">
            1. Register members to be grouped
          </h3>
          <p className="mx-2  text-base  my-2 font-light">
            For the balanced grouping, you need to construct a member table
            where rows are member indices and the columns are options chosen for
            attributes.
            <br></br> First step is to define an attribute which consist of 1)
            name and 2) option list. For example, we can create an attribute
            with name 'gender' which has 'male' and 'female' as the option list.
            To have a valid attribute, you have to decide at least two options.
            Once an attribute is created, you can always modify the name and
            option list by clicking button{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="black"
              className="h-4 w-4  inline-block"
            >
              `
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
              <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
            </svg>{" "}
            . We can toggle or untoggle to apply the attribute into our member
            table. <br></br>
            Second step is compose the member table by adding member{" "}
            <div className="ml-2 inline-block align-middle">
              <button
                className={
                  "inline- bg-sky-500 hover:bg-sky-600 text-center p-1 rounded-lg font-medium text-white px-2 flex flex-row justify-center"
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
            . This creates a new member by randomly choosing options of applied
            attributes. You can edit the options by drop-down selector. You can
            remove each member by clicking
            <div className="inline-block align-middle">
              {" "}
              <button className={" rounded-full hover:bg-slate-200"}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="gray"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            .
          </p>
          <h3 className="text-xl  text-gray-8s00">
            2. Grouping setup and result
          </h3>
          <p className="mx-2  text-base  my-2 font-light">
            Suppose we have built a list consisting of 8 members, considering
            two attributes: gender and ages. Assuming the members have 6 males
            and 2 females in gender attribute, and 4 members of their 10s and 4
            members of 20s respectively. On top of this, let us we need to
            divide them into 2 groups in a balanced way.
            <br></br>
            An ideal grouping would result in 3 males (=(6 males) / (2 groups))
            and a single female (=(2 females) / (2 groups)), totaling 4 members
            per a group. At the same time, it might have 4 teens (=(4 10s) / (2
            groups)) and 4 twenties (=(4 20s) / (2 groups)).
            <br></br>
            Under the hood of our application, a{" "}
            <a href="https://en.wikipedia.org/wiki/Genetic_algorithm">
              {" "}
              <u> genetic algorithm</u>
            </a>{" "}
            is running to find grouping which efforts to match the ideal
            distribution as best as possible. Enjoy your grouping and give me
            any question by email 👇.
          </p>
        </section>
      </div>

      <div className=" flex flex-col items-center bg-white ">
        {" "}
        <div className="flex flex-col items-center py-2 sm:py-5">
          <button
            className="flex items-center"
            onClick={() => {
              window.location.href = `mailto:junbs95@gmail.com?subject=${encodeURIComponent(
                "Hello. I am an user of diverse group"
              )}`;
            }}
          >
            <span className="mr-2 text-gray-500">Contact me: </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="skyblue"
              className="w-8 h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
