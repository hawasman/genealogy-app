'use client'

import { FamilyTreeChart } from "@/app/_components/family-tree-chart"

export default function TreePage() {

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center">
                {/* <h1 className="text-2xl font-bold mb-4">{t('family-tree')}</h1> */}
                <div className="flex w-full gap-4">
                    <FamilyTreeChart familyId={1} />
                </div>
            </div>

        </div>
    )
}