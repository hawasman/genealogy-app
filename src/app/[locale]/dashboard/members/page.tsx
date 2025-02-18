'use client'
import { FamilySelector } from "@/components/family-selector";
import { getFamilyMembers } from "@/server/actions/family-actions";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { MembersAddDialog } from "./member-add-dialog";
import { memberColumns } from "./member-columns";
import { MemberDataTable } from "./member-data-table";

export default function MembersPage() {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
    const t = useTranslations('MembersPage');
    const [familyId, setFamilyId] = useState<number>(0);
    const { data, refetch } = useQuery({ queryKey: ["familyTree", familyId], queryFn: () => getFamilyMembers(familyId) });
    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-4">{t('family-members')}</h1>
                <div className="flex gap-4">
                    {data && data.length > 0 && (
                        <MembersAddDialog open={addDialogOpen} onOpenChange={() => setAddDialogOpen(open => !open)} onSuccess={async () => { setAddDialogOpen(false); await refetch(); }} familyId={familyId} title={t('add-member')} description={t('add-member-description')} triggerText={t('add-member')} />
                    )
                    }
                    <FamilySelector onChange={value => setFamilyId(parseInt(value))} />
                </div>
            </div>
            <MemberDataTable columns={memberColumns} data={data ?? []} />
        </div>
    )
}