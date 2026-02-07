import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Container from "@/components/layout/Container";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      {/* Skip navigation link for keyboard/screen reader accessibility (WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent-orange focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Header
        siteName={settings.siteName}
        logo={settings.logo}
        navigation={settings.navigation}
        contactInfo={settings.contactInfo}
        socialLinks={settings.socialLinks}
      />
      <main id="main-content" className="flex-1">
        <Container>
          <Breadcrumbs />
        </Container>
        {children}
      </main>
      <Footer
        siteName={settings.siteName}
        logo={settings.logo}
        navigation={settings.navigation}
        contactInfo={settings.contactInfo}
        socialLinks={settings.socialLinks}
      />
    </div>
  );
}
