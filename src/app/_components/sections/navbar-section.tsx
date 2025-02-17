import { LangSwitch } from "@/components/lang-switch";
import { Button } from "@/components/ui/button";
import {
    Navbar as NavbarComponent,
    NavbarLeft,
    NavbarRight,
} from "@/components/ui/navbar";
import { Link } from '@/i18n/routing';
import { TreeDeciduousIcon } from "lucide-react";
import { useTranslations } from "next-intl";

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
                        <Button variant="default" asChild>
                            <Link href="/login">{t("getStarted")}</Link>
                        </Button>
                        <LangSwitch />
                    </NavbarRight>
                </NavbarComponent>
            </div>
        </header>
    );
}
