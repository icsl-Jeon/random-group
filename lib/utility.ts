import { AttributeStatistics, AttributeType, Member } from "@/lib/types";
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

export function performGrouping(
  attributeTypeList: AttributeType[],
  memberList: Member[],
  numGroups: number
) {
  // Initialize
  let groupingResult: number[][] = [];

  for (let i = 0; i < numGroups; i++) {
    groupingResult.push([]);
  }

  memberList.map((member, index) => {
    const assignedGroupIndex = index % numGroups;
    groupingResult[assignedGroupIndex].push(member.key);
  });
}
