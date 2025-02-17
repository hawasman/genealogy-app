import { Footer, FooterBottom } from "@/components/ui/footer";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function FooterSection() {
    return (
        <footer className="w-full bg-background px-4">
            <div className="mx-auto max-w-container">
                <Footer className="pt-0">
                    <FooterBottom className="mt-0 flex flex-col items-center gap-4 sm:flex-col md:flex-row">
                        <div>© 2025 Mikołaj Dobrucki. All rights reserved</div>
                        <div className="flex items-center gap-4">
                            <a href="#">Sign in</a> <a href="#">Sign up</a>|
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <ModeToggle />
                        </div>
                    </FooterBottom>
                </Footer>
            </div>
        </footer>
    );
}
