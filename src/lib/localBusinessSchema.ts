// src/lib/localBusinessSchema.js
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "FindsNg",
    "description": "Premium Nigerian fashion and traditional wear store",
    "url": "https://findsng.vercel.app",
    "telephone": "+234-903-314-7769",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "victoria island lagos",
      "addressLocality": "lagos",
      "addressRegion": "lagos",
      "postalCode": "100001",
      "addressCountry": "NG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "6.4281",
      "longitude": "3.4214"
    },
    "openingHours": "Mo-Su 08:00-20:00",
    "priceRange": "₦₦₦",
    "currenciesAccepted": "NGN",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "areaServed": "Nigeria"
  };
}