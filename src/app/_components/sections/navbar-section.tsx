import { LangSwitch } from "@/components/lang-switch";
import { Button } from "@/components/ui/button";
import {
    Navbar as NavbarComponent,
    NavbarLeft,
    NavbarRight,
} from "@/components/ui/navbar";
import { TreeDeciduousIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NavbarSection() {
    const t = useTranslations("NavbarSection");
    return (
        <header className="sticky top-0 z-50 -mb-4 px-4 pb-4">
            <div className="fade-bottom absolute left-0 h-24 w-full bg-background/15 backdrop-blur-lg"></div>
            <div className="relative mx-auto max-w-container">
                <NavbarComponent>
                    <NavbarLeft>
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-xl font-bold"
                        >
                            <TreeDeciduousIcon />
                            {t("title")}
                        </Link>
                    </NavbarLeft>
                    <NavbarRight>
                        <Link href="/" className="hidden text-sm md:block">
                            {t("signIn")}
                        </Link>
                        <Button variant="default" asChild>
                            <Link href="/">{t("getStarted")}</Link>
                        </Button>
                        <LangSwitch />
                    </NavbarRight>
                </NavbarComponent>
            </div>
        </header>
    );
}
