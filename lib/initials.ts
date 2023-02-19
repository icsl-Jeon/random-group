export const initialAttributeTypeList = [
  {
    name: "Hometown",
    optionList: [
      { key: 0, name: "LA" },
      { key: 1, name: "New York" },
    ],
    key: 0,
    newOptionKey: 2,
    isAppliedToMemberList: true,
  },
  {
    name: "Sex",
    optionList: [
      { key: 0, name: "Male" },
      { key: 1, name: "Female" },
    ],
    key: 1,
    newOptionKey: 2,
    isAppliedToMemberList: true,
  },
];

export const initialMemberList = [
  {
    key: 0,
    attributeList: [
      {
        attributeTypeKey: initialAttributeTypeList[0].key,
        attributeTypeValue: initialAttributeTypeList[0].optionList[0],
      },
      {
        attributeTypeKey: initialAttributeTypeList[1].key,
        attributeTypeValue: initialAttributeTypeList[1].optionList[0],
      },
    ],
  },
];
