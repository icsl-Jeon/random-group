export interface Option {
  key: number;
  name: string;
}

export interface AttributeType {
  key: number;
  name: string;
  optionList: Array<Option>;
  newOptionKey: number;
}