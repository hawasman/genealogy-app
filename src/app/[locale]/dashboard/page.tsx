'use client'
import { AddFamilyCard } from "@/app/_components/add-family-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

export default function Page() {
    const t = useTranslations("dashboardPage");
    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center">
                {/* <h1 className="text-2xl font-bold mb-4">Dashboard</h1> */}
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button >{t('add-a-family')}</Button>
                </DialogTrigger>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <DialogContent >
                    <div className="flex flex-col gap-2 pt-4">
                        <h1 className="text-2xl font-bold">{t('add-a-family')}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t('add-a-new-famiy')}
                        </p>
                    </div>
                    <div className="grid gap-4 py-4">
                        <div className="grid items-center gap-4">
                            <AddFamilyCard onAdd={() => toast.success(t('successfully-added-a-new-family'))} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
