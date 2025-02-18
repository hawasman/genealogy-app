/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFamilyNames } from "@/server/actions/family-actions";
import generateFamilyTree from "@/server/actions/tree-actions";
import { type FamilyTreeData, type FamilyTreeNode } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import * as d3 from 'd3';
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export const FamilyTreeChart = () => {
    const t = useTranslations("treePage")
    const [familyId, setFamilyId] = useState(0);
    const { data: familyData, refetch, isLoading } = useQuery({ queryKey: ["generatedFamilyTree", familyId], queryFn: () => generateFamilyTree(familyId) });
    const { data: familyNames, isLoading: isNamesLoading } = useQuery({ queryKey: ["familyNames"], queryFn: () => getFamilyNames() });
    if (isLoading) return <Loader />;
    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex gap-4">
                <Button onClick={() => refetch()}>{t('regenerate')}</Button>
                <Select onValueChange={value => setFamilyId(parseInt(value))}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('select-family')} />
                    </SelectTrigger>
                    <SelectContent>
                        {isNamesLoading && <SelectItem value="0" disabled>{t('loading-names')}</SelectItem>}
                        {!isNamesLoading && !familyNames && <SelectItem value="0" disabled>{t('no-families-found')}</SelectItem>}
                        {!isNamesLoading &&
                            familyNames?.map((family) => <SelectItem key={family.id} value={family.id.toString()}>{family.name}</SelectItem>)
                        }
                    </SelectContent>
                </Select>
            </div>
            {familyData ? <FamilyTree familyData={familyData} /> :
                <div className="flex content-center items-center justify-center ">
                    <p className="text-xl font-bold">{t('no-family-data')}</p>
                </div>
            }
        </div>
    );
};

const FamilyTree: React.FC<{ familyData: FamilyTreeData }> = ({ familyData }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (familyData) {
            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove();

            const width = window.innerWidth;
            const height = window.innerHeight;

            svg.attr("width", width).attr("height", height);
            const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.1, 3]).on("zoom", zoomed) as any;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            svg.call(zoom);

            const g = svg.append("g");

            const nodes: FamilyTreeNode[] = [];
            const links: any = [];

            function createNodesAndLinks(members: FamilyTreeNode[], parent: any = null) {
                members.forEach(member => {
                    const nodeData = { ...member };
                    nodes.push(nodeData);

                    if (parent) {
                        links.push({ source: parent, target: nodeData });
                    }

                    if (member.spouse) {
                        const spouseData = { ...member, isSpouse: true };
                        nodes.push(spouseData);
                        links.push({ source: nodeData, target: spouseData, isSpouseLink: true });
                        if (member.children) {
                            member.children.forEach(child => {
                                const childData = nodes.find(n => n.id === child.id)
                                if (childData)
                                    links.push({ source: spouseData, target: childData });
                            })
                        }
                    }

                    if (member.children) {
                        createNodesAndLinks(member.children, nodeData);
                    }
                });
            }

            createNodesAndLinks(familyData.members, { name: familyData.familyHead });

            const root = d3.hierarchy({ children: nodes }, (d) => d.children) as d3.HierarchyNode<{ children: FamilyTreeNode[] }>;
            const treeLayout = d3.tree().size([width - 200, height - 200]);
            treeLayout(root as d3.HierarchyNode<unknown>);

            g.selectAll(".link")
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                .data(links)
                .enter().append("path")
                .attr("class", "link")
                .attr("d", (d: any) => d3.linkHorizontal()
                    .x((d: any) => d.y)
                    .y((d: any) => d.x)(d as d3.DefaultLinkObject))
                .attr("fill", "none")
                .attr("stroke", (d: any) => d.isSpouseLink ? "red" : "#ccc")
                .attr("stroke-dasharray", (d: any) => d.isSpouseLink ? "5,5" : "none");

            const node = g.selectAll(".node")
                .data(root.descendants())
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", (d) => `translate(${d.y},${d.x})`);

            node.append("circle")
                .attr("r", 10)
                .attr("fill", (d: any) => d.data.isSpouse ? "lightcoral" : "lightblue")
                .attr("stroke", "black");

            node.append("text")
                .attr("dy", "0.31em")
                .attr("x", (d) => d.children ? -15 : 15)
                .style("text-anchor", (d) => d.children ? "end" : "start")
                .text((d: any) => d.data.name);

            function zoomed(event: any) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                g.attr("transform", event.transform);
            }
        }
    }, [familyData]);

    return (
        <div className="w-screen h-screen">
            <svg ref={svgRef}></svg>
        </div>
    );
};