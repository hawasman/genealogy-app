import Female from "@/assets/hijab.png";
import Male from "@/assets/men.png";
import { type FamilyTreeData, type FamilyTreeNode } from "@/utils/types";
import { type Edge, type Node, ConnectionMode, ReactFlow } from '@xyflow/react';
import Image from 'next/image';

const genderColors = {
    male: '#ADD8E6',   // Light blue
    female: '#FFB6C1'  // Light pink
};

const GenderIcon = ({ gender }: { gender: 'male' | 'female' }) => (
    <div className="mx-3" >
        {gender === 'male' ? (
            <Image src={Male} width={20} alt='male' />
        ) : (
            <Image src={Female} width={20} alt='female' />
        )}
    </div>
);

export function FamilyTree({ data }: { data: FamilyTreeData }) {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Create root node
    nodes.push({
        id: 'root',
        data: { label: `${data.familyHead}` },
        position: { x: 0, y: 0 },
        type: 'input',
        dragging: false,
        selectable: false,
        draggable: false,
    });

    const processMembers = (members: FamilyTreeNode[], parentId: string, level: number) => {
        members.forEach((member, index) => {
            const baseX = index * 350; // Increased spacing
            const baseY = level * 100;

            // Member node
            const memberId = `member-${member.id}`;
            nodes.push({
                id: memberId,
                data: {
                    label: (
                        <div className="flex justify-center items-center ">
                            <GenderIcon gender={member.gender} />
                            {member.name}
                        </div>
                    )
                },
                position: { x: baseX, y: baseY },
                style: {
                    background: genderColors[member.gender],
                    padding: '10px',
                    borderRadius: '5px'
                }
            });

            // Connect to parent
            edges.push({
                id: `${parentId}-${memberId}`,
                source: parentId,
                target: memberId,
                type: 'smoothstep',
                selectable: false,
                reconnectable: false
            });

            // If has spouse, create spouse node and connections
            if (member.spouse) {
                const spouseId = `spouse-${member.id}`;
                nodes.push({
                    id: spouseId,
                    data: {
                        label: (
                            <div className="flex justify-center items-center ">
                                <GenderIcon gender={member.gender === 'male' ? 'female' : 'male'} />
                                {member.spouse}
                            </div>
                        )
                    },
                    position: { x: baseX + 150, y: baseY },
                    style: {
                        background: genderColors[member.gender === 'male' ? 'female' : 'male'],
                        padding: '10px',
                        borderRadius: '5px'
                    }
                });
                edges.push({
                    id: `${memberId}-${spouseId}`,
                    source: memberId,
                    target: spouseId,
                    hidden: true,
                    selectable: false,
                    reconnectable: false
                });
            }

            // Process children recursively
            if (member.children.length > 0) {
                processMembers(member.children, memberId, level + 1);
            }
        });
    };

    processMembers(data.members, 'root', 1);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                title={`عائلة: ${data.familyName}`}
                nodes={nodes}
                edges={edges}
                connectionMode={ConnectionMode.Loose}
                fitView
                nodesDraggable={false}
                edgesReconnectable={false}
                nodesConnectable={false}
            />
        </div>
    );
}
