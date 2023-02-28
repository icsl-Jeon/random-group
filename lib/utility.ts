import { AttributeType, Member } from "@/lib/types";
import { initialMemberList } from "@/lib/initials";

export function generateRandomMemberList(
  attributeTypeList: AttributeType[],
  memberNumber: number
) {
  const memberList: Member[] = [];

  for (let i = 0; i < memberNumber; i++) {
    const newMember: Member = {
      key: i,
      attributeList: attributeTypeList.map((attribute) => ({
        attributeTypeKey: attribute.key,
        attributeTypeValue:
          attribute.optionList[
            Math.floor(Math.random() * attribute.optionList.length)
          ],
      })),
    };
    memberList.push(newMember);
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
