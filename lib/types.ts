export type TableRow = Record<string, string>;

export type ToolType =
  | "trim"
  | "replace"
  | "changeType"
  | "removeDuplicates"
  | "handleNulls"
  | "split";

export interface Step {
  id: string;
  tool: ToolType;
  column?: string;
  params?: Record<string, any>;
  label: string;
}

export interface ValidationResult {
  key: string;
  passed: boolean;
  hint: string;
  title: string;
}
