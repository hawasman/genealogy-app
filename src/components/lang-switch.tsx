import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from '@/i18n/routing';
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";

export function LangSwitch() {
    const locale = useLocale()
    const t = useTranslations("locale")
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const params = useParams();

    function onSelectChange(nextLocale: string) {

        startTransition(() => {
            router.replace(
                // @ts-expect-error -- TypeScript will validate that only known `params`
                // are used in combination with a given `pathname`. Since the two will
                // always match for the current route, we can skip runtime checks.
                { pathname, params },
                { locale: nextLocale }
            );
        });
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className={clsx(
                    'relative text-gray-400',
                    isPending && 'transition-opacity [&:disabled]:opacity-30'
                )}>{locale === "ar" ? "العربية" : "English"}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => onSelectChange("ar")}>
                        {t("arabic")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSelectChange("en")}>
                        {t("english")}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
