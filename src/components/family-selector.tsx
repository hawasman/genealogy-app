'use client'
import { getFamilyNames } from "@/server/actions/family-actions";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export const FamilySelector = ({ onChange }: { onChange: (value: string) => void }) => {
    const t = useTranslations("treePage")
    const { data: familyNames, isLoading: isNamesLoading } = useQuery({ queryKey: ["familyNames"], queryFn: () => getFamilyNames() });
    return (
        <div>
            <Select onValueChange={value => onChange(value)}>
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
    )
}