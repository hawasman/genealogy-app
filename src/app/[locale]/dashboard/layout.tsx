import AIChat from "@/app/_components/ai-chat";
import { AppSidebar } from "@/app/_components/navbar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { redirect } from "@/i18n/routing";
import { auth } from "@/server/auth";
import { getLocale } from "next-intl/server";
import { headers } from "next/headers";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        const locale = await getLocale()
        redirect({ href: '/login', locale })
    }
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
                <div>
                    <AIChat />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}