import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SiteSettingsProvider } from '@/components/SiteSettingsProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateDynamicMetadata, getSiteSettings } from '@/lib/metadata';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return generateDynamicMetadata(settings);
}

async function getAnalyticsId() {
  try {
    const settings = await getSiteSettings();
    return settings?.googleAnalyticsId;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const googleAnalyticsId = settings?.googleAnalyticsId;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/api/manifest" />
        <meta name="theme-color" content={settings?.primaryColor || '#DDA430'} />
        {googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-outfit antialiased`}>
        <SiteSettingsProvider initialSettings={settings}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
