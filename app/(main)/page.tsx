import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import PatchNotesSection from '@/components/sections/PatchNotesSection'
import StoreSection from '@/components/sections/StoreSection'

export default function HomePage() {
    return (
        <>
            <HeroSection/>
            <FeaturesSection/>
            <StoreSection/>
            <PatchNotesSection/>
        </>
    )
}