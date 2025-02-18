'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createFamily } from "@/server/actions/family-actions";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export const AddFamilyCard = ({ onAdd }: { onAdd: () => void }) => {
    const t = useTranslations("AddFamilyCard");
    const [gender, setGender] = useState<string>("male");
    const [headName, setHeadName] = useState<string>("");
    const [familyName, setFamilyName] = useState<string>("");
    const locale = useLocale();
    const handleAddFamilySubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        await createFamily(
            { name: familyName, head_id: 0 },
            headName,
            gender,).then((result) => {
                console.log(result);
            }).catch((error) => {
                console.error(error);
            });
        onAdd();
        form.reset();
    }
    return <div>
        <form
            onSubmit={handleAddFamilySubmit}
            className="flex flex-col items-center justify-center gap-4"
        >
            <div className="flex items-center justify-center gap-2">
                <Input type="text" name="familyName" id="familyName" value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder={t('family-name')} />
            </div>

            <div className="flex items-center justify-center gap-2">
                <Input type="text" name="headName" id="headName" value={headName} onChange={(e) => setHeadName(e.target.value)} placeholder={t('head-name')} />
            </div>
            <div className="flex items-center justify-center gap-2">
                {/* <Dropdown options={[{ name: "Male", value: "male" }, { name: "Female", value: "female" }]} value={gender} onChange={(e: { value: string }) => setGender(e.value)} name="gender" optionLabel="name"
                    placeholder="Gender" className="w-full md:w-14rem" /> */}
                <Select dir={locale === "ar" ? "rtl" : "ltr"} onValueChange={value => setGender(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('select-gender')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">{t('male')}</SelectItem>
                        <SelectItem value="female">{t('female')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit">{t('add-family')}</Button>
        </form>
    </div>
};