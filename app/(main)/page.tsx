import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import PatchNotesSection from '@/components/home/PatchNotesSection'
import StoreSection from '@/components/home/StoreSection'

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