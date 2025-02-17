'use client'
import { getFamilyMembers } from "@/server/actions/family-actions";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { TreeAddDialog } from "./tree-add-dialog";
import { treeColumns } from "./tree-columns";
import { TreeDataTable } from "./tree-data-table";

export default function TreePage() {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
    const t = useTranslations('TreePage');
    const [familyId, setFamilyId] = useState<number>(1);
    const { error, data, refetch } = useQuery({ queryKey: ["familyTree", familyId], queryFn: () => getFamilyMembers(familyId) });
    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-4">{t('family-members')}</h1>
                <div className="flex gap-4">
                    <TreeAddDialog open={addDialogOpen} onOpenChange={() => setAddDialogOpen(open => !open)} onSuccess={async () => { setAddDialogOpen(false); await refetch(); }} familyId={familyId} title={t('add-member')} description={t('add-member-description')} triggerText={t('add-member')} />
                </div>
            </div>
            <TreeDataTable columns={treeColumns} data={data ?? []} />
        </div>
    )
}