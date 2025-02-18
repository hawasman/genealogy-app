"use server";

import {
  type createMemberType,
  type FamilyTree,
  type fullMember,
  type MemberWithChildren,
} from "@/utils/types";
import { eq, or, sql } from "drizzle-orm";
import { db } from "../db";
import {
  families,
  members,
  type FamilyInsertType,
  type MemberType,
} from "../db/schema/schema";

export const createFamily = async (
  family: FamilyInsertType,
  headName: string,
  gender: string,
) => {
  const result = await db.insert(families).values(family).returning();
  if (!result[0]) {
    throw new Error("No family created");
  }
  const head = await db
    .insert(members)
    .values({
      family_id: result[0].id,
      name: headName,
      gender,
      generation: 1,
    })
    .returning();

  if (!head[0]) {
    throw new Error("No head created");
  }

  await db
    .update(families)
    .set({ head_id: head[0].id })
    .where(eq(families.id, result[0].id));
  return { family: result[0], head: head[0] };
};

export const getFamily = async (familyId: number) => {
  const result = await db.query.families.findFirst({
    where: eq(families.id, familyId),
  });
  return result;
};

export const getFamilyMember = async (memberId: number) => {
  try {
    const result = await db.query.members.findFirst({
      where: eq(members.id, memberId),
    });
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("No member found");
  }
};

export const getChildren = async (memberId: number | undefined) => {
  if (!memberId) return [];
  const result = await db.query.members.findMany({
    where: or(eq(members.father_id, memberId), eq(members.mother_id, memberId)),
  });
  return result;
};

export const getFamilyMembers = async (familyId: number) => {
  const result = await db.query.members.findMany({
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
    where: eq(members.family_id, familyId),
  });
  return result as fullMember[];
};

export const getFamilyMembersWithChildren = async (id: number) => {
  const result: MemberWithChildren[] = await db.query.members.findMany({
    with: {
      family: {
        columns: {
          id: true,
          name: true,
        },
      },
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
    where: eq(members.family_id, id),
    orderBy: (members, { asc }) => [asc(members.generation)],
  });

  for (const member of result) {
    const children = await getChildren(member.id);
    member.children = children;
  }
  return result;
};

export const createMember = async (
  { name, father_id, mother_id, spouse_id, gender }: createMemberType,
  familyId: number,
) => {
  let generation = 1;
  let father: MemberType | undefined = undefined;
  let mother: MemberType | undefined = undefined;
  if (father_id) {
    father = await getFamilyMember(father_id);
    if (!father) {
      throw new Error("No father found");
    }
    generation = father.generation + 1;
  }

  if (mother_id) {
    mother = await getFamilyMember(mother_id);
    if (!mother) {
      throw new Error("No mother found");
    }
    if (generation === 1) generation = mother.generation + 1;
  }
  if (isNaN(spouse_id ?? NaN)) spouse_id = null;
  if (spouse_id) {
    const spouse = await getFamilyMember(spouse_id);
    generation = Math.max(generation, spouse?.generation ?? 1);
    if (!spouse?.spouse_id) {
      await db
        .update(members)
        .set({ spouse_id: spouse_id })
        .where(eq(members.id, spouse_id));
    }
  }
  try {
    const result = await db
      .insert(members)
      .values({
        family_id: familyId,
        name: name,
        gender,
        generation,
        father_id: father?.id ?? null,
        mother_id: mother?.id ?? null,
        spouse_id: spouse_id,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.log(error);
    throw new Error("No member created");
  }
};

export const getFamilyTree = async (family_id: number) => {
  const familyMembers = await getFamilyMembersWithChildren(family_id);

  const familyTree: FamilyTree[] = [];

  familyMembers.forEach((member) => {
    if (member.father_id) {
      const father = familyTree.find((p) => p.id === member.father_id);
      if (father) {
        father.children.push(member);
      }
    }

    if (member.mother_id) {
      const mother = familyTree.find((p) => p.id === member.mother_id);
      if (mother) {
        mother.children.push(member);
      }
    }

    if (member.spouse_id) {
      const spouse = familyTree.find((p) => p.id === member.spouse_id);
      if (spouse) {
        spouse.children.push(member);
      }
    }
  });

  return familyTree;
};

interface GeneratedMember {
  name: string;
  age: number | null;
  gender: string | null;
  spouse: string | null;
  children: GeneratedMember[];
  member_id: number; // Important for lookup
  spouse_id: number | null;
}

interface GeneratedFamilyTree {
  familyName: string;
  familyHead: string | null;
  members: GeneratedMember[];
}

export async function buildFamilyTree(
  familyId: number,
): Promise<GeneratedFamilyTree> {
  try {
    const familyData = await db.execute(sql`
      WITH RECURSIVE family_tree AS (
          SELECT 
              m.id AS member_id,
              m.name AS member_name,
              s.id AS spouse_id,
              s.name AS spouse_name,
              m.generation,
              ARRAY[]::bigint[] AS ancestors,
              m.father_id,
              m.mother_id
          FROM 
              genealogy_app_member m
          LEFT JOIN 
              genealogy_app_member s ON m.spouse_id = s.id
          WHERE 
              m.generation = 1 AND m.family_id = ${familyId}

          UNION ALL

          SELECT 
              c.id AS member_id,
              c.name AS member_name,
              cs.id AS spouse_id,
              cs.name AS spouse_name,
              c.generation,
              ft.ancestors || c.father_id || c.mother_id,
              c.father_id,
              c.mother_id
          FROM 
              genealogy_app_member c
          LEFT JOIN 
              genealogy_app_member cs ON c.spouse_id = cs.id
          INNER JOIN 
              family_tree ft ON c.father_id = ft.member_id OR c.mother_id = ft.member_id
      )
      SELECT 
          jsonb_build_object(
              'member_id', ft.member_id,
              'member_name', ft.member_name,
              'spouse_id', ft.spouse_id,
              'spouse_name', ft.spouse_name,
              'generation', ft.generation,
              'father_id', ft.father_id,
              'mother_id', ft.mother_id,
              'children', (
                  SELECT COALESCE(jsonb_agg(
                      jsonb_build_object(
                          'member_id', c.id,
                          'member_name', c.name,
                          'spouse_id', cs.id,
                          'spouse_name', cs.name,
                          'father_id', c.father_id,
                          'mother_id', c.mother_id
                      )
                  ), '[]'::jsonb)
                  FROM 
                      genealogy_app_member c
                  LEFT JOIN 
                      genealogy_app_member cs ON c.spouse_id = cs.id
                  WHERE 
                      c.father_id = ft.member_id OR c.mother_id = ft.member_id
              )
          ) AS family_tree
      FROM 
          family_tree ft
      ORDER BY 
          ft.generation, ft.member_id;
  `);
    // console.log(familyData);
    const familyTree: GeneratedFamilyTree = {
      familyName: "Your Family Name",
      familyHead: null,
      members: [],
    };

    const memberMap: Record<number, GeneratedMember> = {};

    familyData.forEach((memberData: Record<string, unknown>) => {
      console.log(memberData);

      const member: GeneratedMember = {
        name: memberData.member_name as string,
        age: null, // Add logic to get age
        gender: null, // Add logic to get gender
        spouse: null, // Will be set later
        children: [],
        member_id: memberData.member_id as number,
        spouse_id: memberData.spouse_id as number | null,
      };

      memberMap[member.member_id] = member;
      familyTree.members.push(member);
    });

    // Set spouses after the members are in the map:
    familyData.forEach((memberData: Record<string, unknown>) => {
      const member = memberMap[memberData.member_id as number];
      if (!member) return;
      member.spouse = memberData.spouse_id
        ? (memberMap[memberData.spouse_id as number]?.name ?? null)
        : null;
    });

    familyData.forEach((memberData: Record<string, unknown>) => {
      const member = memberMap[memberData.member_id as number];
      if (!member) return;
      member.children.forEach((childData: GeneratedMember) => {
        const child: GeneratedMember = {
          name: childData.name,
          age: null, // Add logic to get age
          gender: null, // Add logic to get gender
          spouse: childData.spouse_id
            ? (memberMap[childData.spouse_id]?.name ?? null)
            : null,
          children: [],
          member_id: childData.member_id,
          spouse_id: childData.spouse_id,
        };
        member.children.push(child);
        addChildren(child, memberMap);
      });
    });

    function addChildren(
      parent: GeneratedMember,
      memberMap: Record<number, GeneratedMember>,
    ) {
      familyData.forEach((memberData: Record<string, unknown>) => {
        const member = memberMap[memberData.member_id as number];
        if (
          memberData.father_id === parent.member_id ||
          memberData.mother_id === parent.member_id
        ) {
          if (!member) return;
          const child: GeneratedMember = {
            name: member.name,
            age: null, // Add logic to get age
            gender: null, // Add logic to get gender
            spouse: member.spouse_id
              ? (memberMap[member.spouse_id]?.name ?? null)
              : null,
            children: [],
            member_id: member.member_id,
            spouse_id: member.spouse_id,
          };
          parent.children.push(child);
          addChildren(child, memberMap);
        }
      });
    }

    // Determine family head (example: first member of generation 1)
    if (familyData.length > 0) {
      familyTree.familyHead = (familyData[0]?.member_name as string) ?? null; // Replace with your logic
    }

    return familyTree;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error for handling elsewhere
  }
}

export async function getPaternalLineageNames(
  familyId: number,
): Promise<{ name: string; gender: string; id: number }[]> {
  const sqlQuery = sql`
    SELECT
        m.id AS member_id,
        m.gender AS gender,
        CASE
            WHEN gf.name IS NOT NULL THEN m.name || ' ' || f.name || ' ' || gf.name
            WHEN f.name IS NOT NULL THEN m.name || ' ' || f.name
            ELSE m.name
        END AS full_name
    FROM
        genealogy_app_member m
    LEFT JOIN
        genealogy_app_member f ON m.father_id = f.id
    LEFT JOIN
        genealogy_app_member gf ON f.father_id = gf.id
    WHERE
    m.family_id = ${familyId}
  `;

  const result = await db.execute(sqlQuery);
  const formattedResult = result.map((row) => ({
    name: row.full_name as string,
    gender: row.gender as string,
    id: row.member_id as number,
  }));
  return formattedResult;
}

export const getFamilyNames = async () => {
  const result = await db.query.families.findMany({
    columns: {
      id: true,
      name: true,
    },
  });

  return result;
};
