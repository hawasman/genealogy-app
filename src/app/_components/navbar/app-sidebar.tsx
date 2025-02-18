"use client"

import {
    Loader,
    Trees
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/app/_components/navbar/nav-main"
import { NavUser } from "@/app/_components/navbar/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarRail
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { useLocale, useTranslations } from "next-intl"
import { LangSwitch } from "../../../components/lang-switch"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: session, isPending } = useSession()
    const locale = useLocale()
    const t = useTranslations("sidebar")
    const data = {
        navMain: [
            {
                title: t("familyTree"),
                url: "#",
                icon: Trees,
                isActive: true,
                items: [
                    {
                        title: t("myFamily"),
                        url: "/dashboard/",
                    },
                    {
                        title: t("members"),
                        url: "/dashboard/members",
                    },
                    {
                        title: t("graph"),
                        url: "/dashboard/tree",
                    }
                ],
            },
        ],
    }
    if (isPending) {
        return <Loader />
    }
    return (
        <Sidebar side={locale === "ar" ? "right" : "left"} dir={locale === "ar" ? "rtl" : "ltr"} collapsible="icon" {...props}>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center justify-between gap-2">
                    <div className="w-12">
                        {session && <NavUser user={session.user} />}
                    </div>
                    <LangSwitch />
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
