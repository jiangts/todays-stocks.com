import { Types } from "mongoose";

export type FrequencyType = "daily" | "weekly" | "monthly";
export type VisibilityType = "private" | "unlisted" | "public" | "for-sale";

export interface Strategy {
  id: string;
  name: string;
  description: string;
  createdBy: Types.ObjectId | null;
  frequency?: FrequencyType;
  visibility: VisibilityType;
  createdAt: Date;
  updatedAt: Date;
}
