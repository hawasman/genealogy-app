'use client';
import { AssistantModal } from "@/components/assistant-ui/assistant-modal";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { useLocale } from "next-intl";
export default function AIChat() {
    const locale = useLocale();
    const runtime = useChatRuntime({
        api: "/api/chat",
    });

    return (
        <AssistantRuntimeProvider runtime={runtime}>
            <AssistantModal side={locale === 'ar' ? 'left' : 'right'} />
        </AssistantRuntimeProvider>
    );
}
