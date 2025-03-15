'use client'
import FooterSection from "../_components/sections/footer-section";
import HeroSection from "../_components/sections/hero-section";
import NavbarSection from "../_components/sections/navbar-section";

export default function HomePage() {
  // const t = useTranslations('HomePage');
  // const [familyId, setFamilyId] = useState<number>(1);
  // const { error, data, refetch } = useQuery({ queryKey: ["familyTree", familyId], queryFn: () => getFamilyMembers(familyId) });
  // const { data: familyTreeData, isLoading } = useQuery({ queryKey: ["generatedFamilyTree", familyId], queryFn: () => generateFamilyTree(familyId) });
  return (
    <>
      <main className="flex flex-col min-h-screen w-full">
        <nav>
          <NavbarSection />
        </nav>
        <main>
          <HeroSection />
        </main>
        <footer>
          <FooterSection />
        </footer>
      </main>
    </>
  );
}
