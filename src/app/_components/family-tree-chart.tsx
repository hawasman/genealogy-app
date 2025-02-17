'use client'
import generateFamilyTree from "@/server/actions/tree-actions";
import { type FamilyTreeNode } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Tree, TreeNode } from "react-organizational-chart";


export const FamilyTreeChart = ({ familyId }: { familyId: number }) => {
    const { data: familyTree, refetch, isLoading } = useQuery({ queryKey: ["generatedFamilyTree", familyId], queryFn: () => generateFamilyTree(familyId) });

    if (isLoading) return <div>Loading...</div>;
    if (!familyTree || familyTree.members.length === 0) return <div>No data</div>;
    const members = familyTree.members;
    if (members.constructor !== Array) return <div>No data</div>;
    return (
        <Tree label={<div>{familyTree.familyName}</div>}>
            <TreeNode label={<div>{familyTree.familyHead}</div>}>
                {members.map((node, index) => (
                    <React.Fragment key={index}>
                        <TreeNode key={index} label={<div>{node.name}</div>}>
                            {node.children && recursiveGenerateGraph(node.children)}
                        </TreeNode>
                        {node.spouse && <TreeNode label={<div>{node.spouse}</div>} />}
                    </React.Fragment>
                ))}
            </TreeNode>
        </Tree>
    );
};

const recursiveGenerateGraph = (nodes: FamilyTreeNode[] | undefined | null) => {
    if (!nodes || nodes.length === 0) return null;
    // console.log(nodes);
    return nodes.map((node, index) => (
        <React.Fragment key={index}>
            <TreeNode key={index} label={<div>{node.name}</div>}>
                {node.children && recursiveGenerateGraph(node.children)}
            </TreeNode>
            {node.spouse && <TreeNode label={<div>{node.spouse}</div>} />}
        </React.Fragment>
    ));
};