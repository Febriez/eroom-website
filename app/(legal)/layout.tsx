import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

export default function LegalLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navigation/>
            <main className="min-h-screen bg-black pt-20">
                {children}
            </main>
            <Footer/>
        </>
    )
}