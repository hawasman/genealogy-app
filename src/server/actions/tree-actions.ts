"use server";
import { type FamilyTreeData, type FamilyTreeNode } from "@/utils/types";
import { and, eq, isNotNull, ne, or } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "../auth";
import { db } from "../db";
import { user } from "../db/schema/auth-schema";
import { families, members } from "../db/schema/schema";

async function generateFamilyTree(
  familyId: number,
): Promise<FamilyTreeData | null> {
  try {
    const family = await db
      .select()
      .from(families)
      .where(eq(families.id, familyId))
      .limit(1)
      .execute();

    if (!family || family.length === 0) {
      return null; // Family not found
    }

    const familyData = family[0];
    if (!familyData) {
      throw new Error("No family found");
    }
    const head = familyData.head_id
      ? await db
          .select()
          .from(members)
          .where(eq(members.id, familyData.head_id))
          .limit(1)
          .execute()
      : [];
    if (!head[0]?.name) {
      throw new Error("No head found");
    }
    const familyHeadName = head[0]?.name;

    const membersData = await db.query.members.findMany({
      with: {
        father: {
          columns: { id: true, name: true },
        },
        mother: {
          columns: { id: true, name: true },
        },
        spouse: {
          columns: { id: true, name: true },
        },
      },
      where: and(
        and(eq(members.family_id, familyId), ne(members.id, head[0]?.id)),
        or(isNotNull(members.father_id), isNotNull(members.mother_id)),
      ),
      orderBy: (members, { asc }) => [asc(members.generation)],
    });

    const membersMap = new Map<number, FamilyTreeNode>();

    const calculateAge = (member: typeof members.$inferSelect) => {
      // Example using birthdate, replace with your actual logic
      // if (member.birthdate) {
      //   const birthDate = new Date(member.birthdate);
      //   const today = new Date();
      //   let age = today.getFullYear() - birthDate.getFullYear();
      //   const month = today.getMonth() - birthDate.getMonth();
      //   if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      //     age--;
      //   }
      //   return age;
      // }
      return null; // Replace with your age calculation logic
    };

    // Create member nodes and store them in the map, handling duplicates and spouses
    const processedMembers = new Set<string>(); // Keep track of processed members (by name)

    for (const member of membersData) {
      const memberKey = `${member.id}-${member.family_id}`; // Unique key for each member in a family

      if (!processedMembers.has(memberKey)) {
        // Skip if already processed
        processedMembers.add(memberKey);

        membersMap.set(member.id, {
          id: member.id,
          name: member.name,
          age: calculateAge(member),
          gender: member.gender as "male" | "female",
          spouse: member.spouse?.name ?? null,
          fatherId: member.father?.id ?? null,
          children: [],
        });
      }
    }

    let familyNodes: FamilyTreeNode[] = [];
    // Populate spouse and children, ensuring spouses are not added as separate members
    for (const member of membersData) {
      const memberNode = membersMap.get(member.id);

      if (memberNode) {
        const familyNodesSet = new Set(familyNodes.map((node) => node.id));

        // Check if the child is in the Set AND is NOT a direct child of the head
        if (
          memberNode.fatherId &&
          familyNodesSet.has(memberNode.fatherId) &&
          memberNode.fatherId !== head[0]?.id
        ) {
          // Efficiently remove the child using filter
          familyNodes = familyNodes.filter((node) => node.id !== memberNode.id);
        }
        for (const child of membersData) {
          //check if the child is already in the familyNodes and is not the children of the head
          //   if (
          //     familyNodes.filter((node) => node.id === child.id).length !== 0 &&
          //     child.father_id !== head[0]?.id
          //   ) {
          //     const index = familyNodes.findIndex((node) => node.id === child.id);

          //     if (index !== -1) {
          //       familyNodes.splice(index, 1); // Remove the child from root familyNodes
          //     }
          //   }

          if (child.father_id === member.id || child.mother_id === member.id) {
            const childNode = membersMap.get(child.id);
            if (childNode) {
              memberNode.children.push(childNode);
            }
          }
        }
        familyNodes.push(memberNode);
      }
    }
    familyNodes = familyNodes.filter((node) => node.fatherId === head[0]?.id);
    const familyTree: FamilyTreeData = {
      familyName: familyData.name,
      familyHead: familyHeadName,
      members: familyNodes,
    };

    return familyTree;
  } catch (error) {
    console.error("Error generating family tree:", error);
    return null;
  }
}

export const generateFamilyTreeByUserId = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Not Authenticated");

  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!currentUser) {
    return null;
  }

  return await generateFamilyTree(currentUser.mainFamilyId ?? 0);
};

export default generateFamilyTree;
