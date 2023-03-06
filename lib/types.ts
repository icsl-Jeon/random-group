export interface Option {
  key: number;
  name: string;
}

export interface AttributeType {
  key: number;
  name: string;
  optionList: Array<Option>;
  newOptionKey: number;
  isAppliedToMemberList: boolean;
}

export interface Member {
  key: number;
  attributeList: Array<{
    attributeTypeKey: number;
    attributeTypeValue: Option;
  }>;
}

export interface AttributeStatistics {
  key: number;
  optionCountList: Array<{ key: number; count: number }>;
}

export interface Statistics {
  attributeStatisticsList: Array<AttributeStatistics>;
}
