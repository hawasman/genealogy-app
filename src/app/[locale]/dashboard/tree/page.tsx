'use client'

import { FamilySelector } from '@/components/family-selector';
import generateFamilyTree from '@/server/actions/tree-actions';
import { useQuery } from '@tanstack/react-query';
import '@xyflow/react/dist/style.css';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FamilyTree } from './FamilyTree';


export default function TreePage() {
  const t = useTranslations('TreePage');
  const [familyId, setFamilyId] = useState<number>(0);
  const { data: familyData, isLoading } = useQuery({ queryKey: ["generatedFamilyTree", familyId], queryFn: () => generateFamilyTree(familyId) });
  return (
    <div className="container h-screen w-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">{t('family-tree')}</h1>
        <div className="flex gap-4">
          <FamilySelector onChange={value => setFamilyId(parseInt(value))} />
        </div>
      </div>
      <div className="flex w-full h-full justify-center items-center">
        {familyData && <FamilyTree data={familyData} />}
      </div>
    </div>
  )
}
