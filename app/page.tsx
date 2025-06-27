'use client'

import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import PatchNotesSection from './components/PatchNotesSection'
import Footer from './components/Footer'

export default function HomePage() {
    return (
        <main className="min-h-screen bg-black w-full">
            <HeroSection/>
            <FeaturesSection/>
            <PatchNotesSection/>
            <Footer/>
        </main>
    )
}