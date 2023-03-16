import { initialAttributeTypeList } from "../lib/initials";
import {
  generateRandomMemberList,
  computeStatistics,
  computeDemerit,
  exchangeMembers,
  computeDifference,
} from "../lib/utility";
import { Statistics } from "@/lib/types";

const memberList = generateRandomMemberList(initialAttributeTypeList, 200);

it("computeDemeritDifference", () => {
  const numGroups = 2;

  // desired statistics
  const entireStatistics = computeStatistics(
    initialAttributeTypeList,
    memberList
  );
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

  let groupingResult: number[][] = [];
  let demeritList: number[] = [];
  let statisticsList: Statistics[] = [];

  for (let i = 0; i < numGroups; i++) {
    groupingResult.push([]);
    demeritList.push(0.0);
    statisticsList.push({ attributeStatisticsList: [] });
  }

  // initial grouping
  memberList.map((member, index) => {
    const assignedGroupIndex = index % numGroups;
    groupingResult[assignedGroupIndex].push(member.key);
  });

  // compute demerit for each group
  groupingResult.map((group, index) => {
    const memberListOfGroup = group.map((key) => {
      return memberList[memberList.findIndex((member) => member.key === key)];
    });
    const statistics = computeStatistics(
      initialAttributeTypeList,
      memberListOfGroup
    );
    statisticsList[index].attributeStatisticsList = statistics;
    demeritList[index] = computeDemerit(
      { attributeStatisticsList: statistics },
      desiredStatistics
    );
  });

  const memberList1 = groupingResult[0].map((key) => {
    return memberList[memberList.findIndex((member) => member.key === key)];
  });
  const demerit1 = demeritList[0];
  const statistics1 = statisticsList[0];
  const memberList2 = groupingResult[1].map((key) => {
    return memberList[memberList.findIndex((member) => member.key === key)];
  });
  const demerit2 = demeritList[1];
  const statistics2 = statisticsList[1];

  let totalTimeNaiveApproach = 0;
  let totalTimeDiffApproach = 0;

  for (
    let indexFromGroup1 = 0;
    indexFromGroup1 < groupingResult[0].length;
    indexFromGroup1++
  ) {
    for (
      let indexFromGroup2 = 0;
      indexFromGroup2 < groupingResult[1].length;
      indexFromGroup2++
    ) {
      // approach 1: compute all newly
      let startTime = new Date();

      const [newGroup1, newGroup2] = exchangeMembers(
        memberList1,
        memberList2,
        indexFromGroup1,
        indexFromGroup2
      );
      const newStatistics1 = computeStatistics(
        initialAttributeTypeList,
        newGroup1
      );
      const newDemerit1 = computeDemerit(
        { attributeStatisticsList: newStatistics1 },
        desiredStatistics
      );
      const newStatistics2 = computeStatistics(
        initialAttributeTypeList,
        newGroup2
      );
      const newDemerit2 = computeDemerit(
        { attributeStatisticsList: newStatistics2 },
        desiredStatistics
      );

      let endTime = new Date();
      let elapsedTime = endTime.getTime() - startTime.getTime();
      totalTimeNaiveApproach += elapsedTime;

      const key1 = groupingResult[0][indexFromGroup1];
      const key2 = groupingResult[1][indexFromGroup2];
      const member1 = memberList.find((member) => member.key === key1);
      const member2 = memberList.find((member) => member.key === key2);
      if (!member1 || !member2) {
        console.error("invalid");
        continue;
      }

      startTime = new Date();

      // approach 2: compute only difference

      const [demerit1Diff1, changedStatisticsFrom1Out] = computeDifference(
        member1,
        true,
        statistics1,
        desiredStatistics
      );
      const [demerit1Diff2, changedStatisticsFrom2In] = computeDifference(
        member2,
        false,
        changedStatisticsFrom1Out,
        desiredStatistics
      );

      const [demerit2Diff1, changedStatisticsFrom2Out] = computeDifference(
        member2,
        true,
        statistics2,
        desiredStatistics
      );
      const [demerit2Diff2, changedStatisticsFrom1In] = computeDifference(
        member1,
        false,
        changedStatisticsFrom2Out,
        desiredStatistics
      );
      endTime = new Date();
      elapsedTime = endTime.getTime() - startTime.getTime();
      totalTimeDiffApproach += elapsedTime;

      expect(newDemerit1).toBe(demerit1 + demerit1Diff1 + demerit1Diff2);
      expect(newDemerit2).toBe(demerit2 + demerit2Diff1 + demerit2Diff2);
    }
  }

  console.log("naive vs diff: ", totalTimeNaiveApproach, totalTimeDiffApproach);
});
