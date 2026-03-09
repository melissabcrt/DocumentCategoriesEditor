export interface DocumentCategory {
  name: string;
  subtext: string;
  namingConvention: string;
  templateUrl: string;
  searchString: string;
  required: boolean;
  requiredCount: number;
  requiredInfo: string;
}

export const emptyCategory = (): DocumentCategory => ({
  name: "",
  subtext: "",
  namingConvention: "",
  templateUrl: "",
  searchString: "",
  required: false,
  requiredCount: 0,
  requiredInfo: ""
});