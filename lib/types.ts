import { ROLE_VALUES } from "./constants";

/* lib/types.ts */
export const FIELD_TYPES = [
  "text",
  "email",
  "textarea",
  "select",
  "checkbox",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldSchema {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  options?: FieldOption[];      // لقائمتى select & checkbox
}

export interface FormSchema {
  name: string;
  slug: string;
  description?: string;
  fields: FieldSchema[];
}
export type Role = (typeof ROLE_VALUES)[number];