'use client'

import { createFamily } from "@/server/actions/family-actions";
import { useState } from "react";

export const AddFamilyCard = ({ onAdd }: { onAdd: () => void }) => {

    const [gender, setGender] = useState<string>("male");
    const [headName, setHeadName] = useState<string>("");
    const [familyName, setFamilyName] = useState<string>("");
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
    return <Card>
        <form
            onSubmit={handleAddFamilySubmit}
            className="flex flex-col items-center justify-center gap-4"
        >
            <div className="flex items-center justify-center gap-2">
                <InputText type="text" name="familyName" id="familyName" value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="Family name" />
            </div>

            <div className="flex items-center justify-center gap-2">
                <InputText type="text" name="headName" id="headName" value={headName} onChange={(e) => setHeadName(e.target.value)} placeholder="Head name" />
            </div>
            <div className="flex items-center justify-center gap-2">
                <Dropdown options={[{ name: "Male", value: "male" }, { name: "Female", value: "female" }]} value={gender} onChange={(e: { value: string }) => setGender(e.value)} name="gender" optionLabel="name"
                    placeholder="Gender" className="w-full md:w-14rem" />
                {/* <label htmlFor="gender">Gender:</label>
                <select name="gender" id="gender">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select> */}
            </div>
            <Button type="submit">Add family</Button>
        </form>
    </Card>
};