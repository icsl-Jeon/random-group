import {
  AttributeStatistics,
  AttributeType,
  Member,
  Statistics,
} from "@/lib/types";
import { initialMemberList } from "@/lib/initials";
import { attribute } from "postcss-selector-parser";

export function generateRandomMember(
  attributeTypeList: AttributeType[],
  key: number
) {
  const newMember: Member = {
    key: key,
    attributeList: attributeTypeList
      .filter((attribute) => attribute.isAppliedToMemberList)
      .map((attribute) => ({
        attributeTypeKey: attribute.key,
        attributeTypeValue:
          attribute.optionList[
            Math.floor(Math.random() * attribute.optionList.length)
          ],
      })),
  };
  return newMember;
}

export function generateRandomMemberList(
  attributeTypeList: AttributeType[],
  memberNumber: number
) {
  const memberList: Member[] = [];

  for (let i = 0; i < memberNumber; i++) {
    memberList.push(generateRandomMember(attributeTypeList, i));
  }
  return memberList;
}

export function removeAttribute(
  member: Member,
  keyRemovedAttribute: number
): Member {
  return {
    ...member,
    attributeList: member.attributeList.filter((attribute) => {
      return attribute.attributeTypeKey !== keyRemovedAttribute;
    }),
  };
}

export function addAttribute(member: Member, attribute: AttributeType): Member {
  let newAttributeList = member.attributeList;
  newAttributeList.push({
    attributeTypeKey: attribute.key,
    attributeTypeValue:
      attribute.optionList[
        Math.floor(Math.random() * attribute.optionList.length)
      ],
  });
  return { ...member, attributeList: newAttributeList };
}

export function computeStatistics(
  attributeTypeList: AttributeType[],
  memberList: Member[]
) {
  const attributeStatisticsList = Array<AttributeStatistics>();
  for (const attributeType of attributeTypeList) {
    if (!attributeType.isAppliedToMemberList) continue;
    const attributeStatistics: AttributeStatistics = {
      key: attributeType.key,
      optionCountList: attributeType.optionList.map((option) => {
        return {
          key: option.key,
          count: 0,
        };
      }),
    };
    attributeStatisticsList.push(attributeStatistics);
  }

  for (const member of memberList) {
    for (const attribute of member.attributeList) {
      const attributeTypeKey = attribute.attributeTypeKey;
      const attributeTypeValue = attribute.attributeTypeValue;

      const attributeIndex = attributeStatisticsList.findIndex(
        (statistics) => statistics.key === attributeTypeKey
      );
      const optionIndex = attributeStatisticsList[
        attributeIndex
      ].optionCountList.findIndex(
        (option) => option.key === attributeTypeValue.key
      );

      attributeStatisticsList[attributeIndex].optionCountList[optionIndex]
        .count++;
    }
  }
  return attributeStatisticsList;
}

export function computeDemerit(
  statistics: Statistics,
  idealStatistics: Statistics
) {
  let demerit = 0;
  if (
    statistics.attributeStatisticsList.length !==
    idealStatistics.attributeStatisticsList.length
  ) {
    console.error("Cannot compute demerit");
    return -1;
  }

  for (let i = 0; i < statistics.attributeStatisticsList.length; i++) {
    const attributeStatisticsList = statistics.attributeStatisticsList[i];
    const idealAttributeStatisticsList =
      idealStatistics.attributeStatisticsList[i];
    if (
      attributeStatisticsList.optionCountList.length !==
      idealAttributeStatisticsList.optionCountList.length
    ) {
      console.error("Cannot compute demerit");
      return -1;
    }
    for (let j = 0; j < attributeStatisticsList.optionCountList.length; j++) {
      const count = attributeStatisticsList.optionCountList[j].count;
      const idealCount = idealAttributeStatisticsList.optionCountList[j].count;
      // assuming ideal count is lower bound
      demerit += Math.min(
        Math.abs(count - idealCount),
        Math.abs(count - (idealCount + 1))
      );
    }
  }
  return demerit;
}

export function performGrouping(
  attributeTypeList: AttributeType[],
  memberList: Member[],
  numGroups: number
) {
  const entireStatistics = computeStatistics(attributeTypeList, memberList);
  const desiredStatistics = {
    attributeStatisticsList: entireStatistics.map((statistics) => {
      return {
        key: statistics.key,
        optionCountList: statistics.optionCountList.map((optionCount) => {
          return {
            key: optionCount.key,
            count: Math.floor(optionCount.count / numGroups),
          };
        }),
      };
    }),
  };

  // Initialize grouping
  let groupingResult: number[][] = [];
  let demeritList: number[] = [];

  for (let i = 0; i < numGroups; i++) {
    groupingResult.push([]);
    demeritList.push(0.0);
  }

  memberList.map((member, index) => {
    const assignedGroupIndex = index % numGroups;
    groupingResult[assignedGroupIndex].push(member.key);
  });
  // Initialize demerit
  groupingResult.map((group, index) => {
    const memberListOfGroup = group.map((key) => {
      return memberList[key];
    });

    demeritList[index] = computeDemerit(
      {
        attributeStatisticsList: computeStatistics(
          attributeTypeList,
          memberListOfGroup
        ),
      },
      desiredStatistics
    );
  });

  let need_improve = groupingResult;
  const groupIndexList = Array(memberList.length).keys();
  // while (need_improve) {
  //   // check need improve
  //   const worstDemerit = Math.max(...demeritList);
  //   const worstGroupIndex = demeritList.findIndex(
  //     (elem) => elem === worstDemerit
  //   );
  //   // otherGroupIndexList =
  // }
  console.log("hey");
}
