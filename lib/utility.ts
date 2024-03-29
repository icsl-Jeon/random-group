import {
  AttributeStatistics,
  AttributeType,
  Member,
  Statistics,
} from "@/lib/types";

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

export function exchangeMembers(
  memberList1: Member[],
  memberList2: Member[],
  index1: number,
  index2: number
): [Member[], Member[]] {
  if (memberList1.length === 0 || memberList2.length === 0) {
    throw new Error("Both arrays must contain at least one element");
  }

  if (
    index1 < 0 ||
    index1 >= memberList1.length ||
    index2 < 0 ||
    index2 >= memberList2.length
  ) {
    throw new Error("Invalid index value");
  }

  const newMemberList1 = [...memberList1];
  const newMemberList2 = [...memberList2];

  const tempMember = newMemberList1[index1];
  newMemberList1[index1] = newMemberList2[index2];
  newMemberList2[index2] = tempMember;

  return [newMemberList1, newMemberList2];
}

export function computeDifference(
  member: Member,
  isOut: boolean,
  prevStatistics: Statistics,
  idealStatistics: Statistics
): [number, Statistics] {
  let demeritDifference = 0;
  let newStatistics: Statistics = JSON.parse(JSON.stringify(prevStatistics));

  for (const attributeType of member.attributeList) {
    const optionKey = attributeType.attributeTypeValue.key;

    const previousCount = prevStatistics.attributeStatisticsList
      .find((item) => item.key === attributeType.attributeTypeKey)
      ?.optionCountList.find((item) => item.key === optionKey)?.count;

    if (!previousCount) continue;

    const newCount = previousCount + (isOut ? -1 : 1);
    const attributeStatistics = newStatistics.attributeStatisticsList.find(
      (item) => item.key === attributeType.attributeTypeKey
    );
    if (attributeStatistics) {
      const optionCount = attributeStatistics.optionCountList.find(
        (item) => item.key === optionKey
      );
      if (optionCount) {
        const updatedOptionCount = { ...optionCount, count: newCount };
        const updatedOptionCountList = attributeStatistics.optionCountList.map(
          (item) => {
            return item.key === optionKey ? updatedOptionCount : item;
          }
        );
        attributeStatistics.optionCountList = updatedOptionCountList;
      }
    }

    const idealCount = idealStatistics.attributeStatisticsList
      .find((item) => item.key === attributeType.attributeTypeKey)
      ?.optionCountList.find((item) => item.key === optionKey)?.count;

    if (idealCount && previousCount) {
      if (previousCount < idealCount) {
        if (isOut) demeritDifference++;
        else demeritDifference--;
      } else if (previousCount === idealCount) {
        if (isOut) demeritDifference++;
      } else if (previousCount === idealCount + 1) {
        if (!isOut) demeritDifference++;
      } else {
        if (isOut) demeritDifference--;
        else demeritDifference++;
      }
    }
  }
  return [demeritDifference, newStatistics];
}

export function findBestExchange(
  memberList1: Member[],
  memberList2: Member[],
  attributeList: AttributeType[],
  desiredStatistics: Statistics
): [Member, Member] {
  let minimum_demerit = 1e7;
  // Exchange a member from memberList 1 to memberList 2, s.t. maximum of demerit is minimized
  let member1_index_exchange = 0;
  let member2_index_exchange = 0;
  for (
    let member1_index = 0;
    member1_index < memberList1.length;
    member1_index++
  ) {
    for (
      let member2_index = 0;
      member2_index < memberList2.length;
      member2_index++
    ) {
      const [newMemberList1, newMemberList2] = exchangeMembers(
        memberList1,
        memberList2,
        member1_index,
        member2_index
      );

      const newStatistics1 = computeStatistics(attributeList, newMemberList1);
      const newDemerit1 = computeDemerit(
        { attributeStatisticsList: newStatistics1 },
        desiredStatistics
      );
      const newStatistics2 = computeStatistics(attributeList, newMemberList2);
      const newDemerit2 = computeDemerit(
        { attributeStatisticsList: newStatistics2 },
        desiredStatistics
      );

      if (Math.max(newDemerit1, newDemerit2) < minimum_demerit) {
        minimum_demerit = Math.max(newDemerit1, newDemerit2);
        member1_index_exchange = member1_index;
        member2_index_exchange = member2_index;
      }
    }
  }

  return [
    memberList1[member1_index_exchange],
    memberList2[member2_index_exchange],
  ];
}

export function performGrouping(
  attributeTypeList: AttributeType[],
  memberList: Member[],
  numGroups: number
): number[][] {
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

  interface Status {
    demerit: number;
    statistics: Statistics;
  }

  // Initialize grouping
  let groupingResult: number[][] = [];
  let statusList: Status[] = [];

  for (let i = 0; i < numGroups; i++) {
    groupingResult.push([]);
    statusList.push({
      demerit: 0.0,
      statistics: { attributeStatisticsList: [] },
    });
  }

  memberList.map((member, index) => {
    const assignedGroupIndex = index % numGroups;
    groupingResult[assignedGroupIndex].push(member.key);
  });

  // Initialize demerit and statistics
  groupingResult.map((group, index) => {
    const memberListOfGroup = group.map((key) => {
      return memberList[memberList.findIndex((member) => member.key === key)];
    });
    const statistics = computeStatistics(attributeTypeList, memberListOfGroup);
    const demerit = computeDemerit(
      { attributeStatisticsList: statistics },
      desiredStatistics
    );

    statusList[index] = {
      demerit: demerit,
      statistics: { attributeStatisticsList: statistics },
    };
  });

  let need_improve = true;
  const groupIndexList = Array.from({ length: statusList.length }, (_, i) => i);
  let iterCompleteCount = 0;
  const maxIter = 200;

  while (need_improve && iterCompleteCount < maxIter) {
    // find worst group
    const worstStatus = statusList.reduce((prev, curr) =>
      prev.demerit < curr.demerit ? curr : prev
    );
    const worstGroupIndex = statusList.findIndex(
      (elem) => elem === worstStatus
    );

    console.log(worstStatus.demerit);

    // pick random other group
    const otherGroupIndexList = groupIndexList.filter(
      (index) => index !== worstGroupIndex
    );
    const randomOtherGroupIndex =
      otherGroupIndexList[
        Math.floor(Math.random() * otherGroupIndexList.length)
      ];

    // exchange member
    const worstMemberList = groupingResult[worstGroupIndex].map((key) => {
      return memberList[memberList.findIndex((member) => member.key === key)];
    });
    const randomOtherMemberList = groupingResult[randomOtherGroupIndex].map(
      (key) => {
        return memberList[memberList.findIndex((member) => member.key === key)];
      }
    );

    const [exchangeMemberWorst, exchangeMemberRandomOther] = findBestExchange(
      worstMemberList,
      randomOtherMemberList,
      attributeTypeList,
      desiredStatistics
    );

    const indexFromWorstGroup = worstMemberList.findIndex(
      (item) => item === exchangeMemberWorst
    );
    const indexFromRandomOtherGroup = randomOtherMemberList.findIndex(
      (item) => item === exchangeMemberRandomOther
    );

    const [newWorstGroupMemberList, newRandomOtherGroupMemberList] =
      exchangeMembers(
        worstMemberList,
        randomOtherMemberList,
        indexFromWorstGroup,
        indexFromRandomOtherGroup
      );

    // update reflecting new member list
    groupingResult[worstGroupIndex] = [
      ...newWorstGroupMemberList.map((member) => member.key),
    ];
    groupingResult[randomOtherGroupIndex] = [
      ...newRandomOtherGroupMemberList.map((member) => member.key),
    ];

    statusList[worstGroupIndex].statistics.attributeStatisticsList =
      computeStatistics(attributeTypeList, newWorstGroupMemberList);
    statusList[worstGroupIndex].demerit = computeDemerit(
      statusList[worstGroupIndex].statistics,
      desiredStatistics
    );
    statusList[randomOtherGroupIndex].statistics.attributeStatisticsList =
      computeStatistics(attributeTypeList, newRandomOtherGroupMemberList);
    statusList[randomOtherGroupIndex].demerit = computeDemerit(
      statusList[randomOtherGroupIndex].statistics,
      desiredStatistics
    );

    iterCompleteCount++;
  }
  return groupingResult;
}
