import SignIn from "@/app/_components/sign-in";
import { SignUp } from "@/app/_components/sign-up";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useLocale, useTranslations } from "next-intl";

export default function AuthPage() {
    const locale = useLocale();
    const t = useTranslations("auth");
    return (
        <div className="flex items-center justify-center w-full">
            <Tabs dir={locale === "ar" ? "rtl" : "ltr"} defaultValue="signin" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">{t("signIn")}</TabsTrigger>
                    <TabsTrigger value="signup">{t("signUp")}</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <SignIn />
                </TabsContent>
                <TabsContent value="signup">
                    <SignUp />
                </TabsContent>
            </Tabs>
        </div>
    )
}
