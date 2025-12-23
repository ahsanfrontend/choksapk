import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnalyticsTracker from '@/components/AnalyticsTracker';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AnalyticsTracker />
            <Header />
            <main className="flex-1 min-h-screen bg-background">{children}</main>
            <Footer />
        </>
    );
}
