import { type MemberType } from "@/server/db/schema/schema";

export type FamilyTree = {
  id: number;
  name: string;
  gender: "male" | "female";
  generation: number;
  father: MemberType;
  mother: MemberType;
  spouse: MemberType;
  children: MemberType[];
};

export interface FamilyMember {
  id: number;
  name: string;
  family_id: number;
  generation: number;
  gender: string;
  father_id: number | null;
  mother_id: number | null;
  spouse_id: number | null;
  createdAt: string;
  updatedAt: string;
  father: FamilyMember | null;
  mother: FamilyMember | null;
  spouse: FamilyMember | null;
  children: FamilyMember[];
}

export type MemberWithChildren = MemberType & {
  id: number;
  generation: number;
  children?: MemberWithChildren[];
};

export type createMemberType = {
  name: string;
  gender: "male" | "female";
  father_id: number | null;
  mother_id: number | null;
  spouse_id: number | null;
};

// export type GraphData = {
//   familyName: string;
//   familyHead: string;
//   data: GraphNode[];
// };
// export type GraphNode = {
//   index: number;
//   position: string;
//   name: string;
//   spouse: string;
//   gender: string;
//   children: GraphNode[];
// };

export interface FamilyTreeNode {
  id: number;
  name: string;
  age: number | null; // Age can be null if not available
  gender: string;
  spouse: string | null;
  fatherId: number | null;
  children: FamilyTreeNode[];
}

export interface FamilyTreeData {
  familyName: string;
  familyHead: string | null;
  members: FamilyTreeNode[];
}
