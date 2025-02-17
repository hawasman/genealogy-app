'use client'

import { createMember } from "@/server/actions/family-actions";
import { useState } from "react";

export const AddFamilyMemberCard = ({ familyId, onAdd }: { familyId: number, onAdd: () => void }) => {
    const [gender, setGender] = useState<"male" | "female">("male");
    const [name, setName] = useState<string>("");
    const [fatherId, setFatherId] = useState<number | null>(null);
    const [motherId, setMotherId] = useState<number | null>(null);
    const [spouseId, setSpouseId] = useState<number | null>(null);
    const handleAddFamilyMemberSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        await createMember(
            {
                name,
                gender,
                father_id: fatherId,
                mother_id: motherId,
                spouse_id: spouseId
            },
            familyId
        ).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.error(error);
        });
        onAdd();
        form.reset();
    }
    return (
        <Card>
            <form
                onSubmit={handleAddFamilyMemberSubmit}
                className="flex flex-col items-center justify-center gap-4"
            >
                <div className="flex items-center justify-center gap-2">
                    <InputText type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                </div>
                <div className="flex items-center justify-center gap-2">
                    <InputText type="number" name="fatherId" id="fatherId" value={fatherId?.toString()} onChange={(e) => setFatherId(parseInt(e.target.value))} placeholder="father" />
                </div>
                <div className="flex items-center justify-center gap-2">
                    <InputText type="number" name="motherId" id="motherId" value={motherId?.toString()} onChange={(e) => setMotherId(parseInt(e.target.value))} placeholder="mother" />
                </div>
                <div className="flex items-center justify-center gap-2">
                    <InputText type="number" name="spouseId" id="spouseId" value={spouseId?.toString()} onChange={(e) => setSpouseId(parseInt(e.target.value))} placeholder="spouse" />
                </div>
                <div className="flex items-center justify-center gap-2">
                    <Dropdown options={[{ name: "Male", value: "male" }, { name: "Female", value: "female" }]} value={gender} onChange={(e: { value: string }) => setGender(e.value as "male" | "female")} name="gender" optionLabel="name"
                        placeholder="Gender" className="w-full md:w-14rem" />
                </div>
                <Button type="submit">Add Member</Button>
            </form>
        </Card>
    )
}