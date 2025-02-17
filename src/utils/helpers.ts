export type FamilyTreeView = {
  label: string;
  expanded: boolean;
  children: FamilyTreeView[];
};

// export const GenerateGenerations = (familyMembers: MemberWithChildren[]) => {
//   const processedIds: Set<number> = new Set<number>();
//   const generatedGenerations: GraphNode[] = [];
//   familyMembers.sort((a, b) => {
//     if (a.generation > b.generation) return 1;
//     if (a.generation < b.generation) return -1;
//     return 0;
//   });
//   const highestGen =
//     familyMembers[familyMembers.length - 1]?.generation ?? familyMembers.length;
//   for (let lastGen = 1; lastGen < highestGen; lastGen++) {
//     const currentGenMembers = familyMembers.filter(
//       (member) => member.generation == lastGen,
//     );
//     // console.log(currentGenMembers);
//     for (const member of currentGenMembers) {
//       if (!member.id) continue;
//       if (processedIds.has(member.id)) continue;
//       processedIds.add(member.id);
//       if (member.generation == 1) {
//         generatedGenerations.push({
//           index: 1,
//           position: "1",
//           data: member,
//         });
//         continue;
//       }
//       if (member.generation >= lastGen) {
//         lastGen = member.generation;
//         let tempPosition = "";
//         for (let index = 1; index <= lastGen; index++) {
//           tempPosition =
//             tempPosition === "" ? tempPosition + "1" : tempPosition + ",1";
//         }

//         generatedGenerations.push({
//           index: member.generation,
//           position: tempPosition,
//           data: member,
//         });

//         if (!member.children || member.children.length == 0) continue;

//         for (const child of member.children) {
//           const childIndex = member.generation + 1;
//           if (!child.id) continue;
//           if (processedIds.has(child.id)) continue;
//           processedIds.add(child.id);
//           const childGen = lastGen + 1;
//           let tempPosition = "";
//           for (let index = 1; index <= childGen; index++) {
//             tempPosition =
//               tempPosition === "" ? tempPosition + "1" : tempPosition + ",1";
//           }
//           generatedGenerations.push({
//             index: childIndex,
//             position: tempPosition,
//             data: child,
//           });
//         }
//       }
//     }
//   }

//   const maxVal = Math.max(
//     ...generatedGenerations.map((o) => o.data.generation),
//   );
//   const result = generatedGenerations.sort((a, b) => a.index - b.index);
//   return result;
// };
