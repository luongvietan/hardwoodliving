import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Container from "@/components/layout/Container";
import {
  getSiteSettings,
  defaultNavigation,
  defaultContactInfo,
  defaultSocialLinks,
} from "@/lib/sanity/siteSettings";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  const siteName = settings.siteName || "Hardwood Living";
  const navigation = settings.navigation?.map((n) => ({
    label: n.title,
    href: n.path,
  })) || defaultNavigation.map((n) => ({ label: n.title, href: n.path }));
  const contactInfo = {
    phone: settings.contactInfo?.phone || defaultContactInfo.phone,
    email: settings.contactInfo?.email || defaultContactInfo.email,
    address: settings.contactInfo?.address || defaultContactInfo.address,
  };
  const socialLinks = settings.socialLinks?.map((s) => ({
    label: s.platform,
    href: s.url,
  })) || defaultSocialLinks.map((s) => ({ label: s.platform, href: s.url }));

  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip navigation link for keyboard/screen reader accessibility (WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-amber-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Header siteName={siteName} navigation={navigation} />
      <main id="main-content" className="flex-1">
        <Container>
          <Breadcrumbs />
        </Container>
        {children}
      </main>
      <Footer
        siteName={siteName}
        navigation={navigation}
        contactInfo={contactInfo}
        socialLinks={socialLinks}
      />
    </div>
  );
}
