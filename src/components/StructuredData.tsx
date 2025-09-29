import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

interface StructuredDataProps {
  type?: 'website' | 'organization' | 'article' | 'product';
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

export const StructuredData: React.FC<StructuredDataProps> = ({
  type = 'website',
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author
}) => {
  const { language } = useLanguage();
  const isJapanese = language === 'ja';

  const generateStructuredData = () => {
    const baseUrl = 'https://protoduct.jp';
    const defaultTitle = isJapanese
      ? 'ProtoductAI Studio - 未来の没入体験アプリを量産するスタジオ'
      : 'ProtoductAI Studio - Studio for Mass-Producing Future Immersive Experience Apps';
    const defaultDescription = isJapanese
      ? 'ProtoductAI Studioは、未来の没入体験ができるアプリを量産するスタジオです。革新的なテクノロジーで次世代の体験を創造します。'
      : 'ProtoductAI Studio is a studio for mass-producing apps that enable future immersive experiences. We create next-generation experiences with innovative technology.';

    const commonData = {
      "@context": "https://schema.org",
      "name": title || defaultTitle,
      "description": description || defaultDescription,
      "url": url || baseUrl,
      "image": image || `${baseUrl}/og-image.png`,
      "inLanguage": isJapanese ? "ja-JP" : "en-US"
    };

    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "ProtoductAI株式会社",
          "alternateName": "ProtoductAI Inc.",
          "url": baseUrl,
          "logo": `${baseUrl}/og-image.png`,
          "description": isJapanese
            ? "未来の没入体験ができるアプリを量産するスタジオとして、革新的なテクノロジーで次世代の体験を創造する会社です。"
            : "A company that creates next-generation experiences with innovative technology as a studio for mass-producing apps that enable future immersive experiences.",
          "foundingDate": "2024",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "祇園町南側582",
            "addressLocality": "京都市東山区",
            "postalCode": "605-0074",
            "addressRegion": "京都府",
            "addressCountry": "JP"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+81-XX-XXXX-XXXX",
            "contactType": "customer service",
            "email": "protoduct3@gmail.com"
          },
          "sameAs": [
            "https://twitter.com/protoduct_ai"
          ]
        };

      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          ...commonData,
          "publisher": {
            "@type": "Organization",
            "name": "ProtoductAI株式会社",
            "logo": `${baseUrl}/og-image.png`
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/products?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        };

      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": title || defaultTitle,
          "description": description || defaultDescription,
          "url": url || baseUrl,
          "image": image || `${baseUrl}/og-image.png`,
          "datePublished": datePublished || new Date().toISOString(),
          "dateModified": dateModified || new Date().toISOString(),
          "author": {
            "@type": "Person",
            "name": author || "ProtoductAI",
            "url": baseUrl
          },
          "publisher": {
            "@type": "Organization",
            "name": "ProtoductAI株式会社",
            "logo": `${baseUrl}/og-image.png`
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url || baseUrl
          }
        };

      case 'product':
        return {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": title || defaultTitle,
          "description": description || defaultDescription,
          "url": url || baseUrl,
          "image": image || `${baseUrl}/og-image.png`,
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "JPY",
            "availability": "https://schema.org/InStock"
          },
          "provider": {
            "@type": "Organization",
            "name": "ProtoductAI株式会社"
          }
        };

      default:
        return commonData;
    }
  };

  const structuredData = generateStructuredData();

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
    </Helmet>
  );
};