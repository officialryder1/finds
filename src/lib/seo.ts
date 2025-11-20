// src/lib/seo.js

export function generateProductSchema(product, categories) {
  const category = categories?.find(c => c.id === product.category_id);
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description || `Beautiful ${category?.name || 'Nigerian'} fashion piece`,
    "image": product.image_path ? getImageUrl(product.image_path) : null,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "finds.ng"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://madeinaba.com/products/${product.id}`,
      "priceCurrency": "NGN",
      "price": product.price,
      "availability": product.stock_quantity > 0 ? 
        "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "finds.ng"
      }
    },
    "category": category?.name || "Fashion"
  };
}

export function generateBreadcrumbSchema(path, items) {
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://finds.ng.vercel.app${item.item}`
    }))
  };
  
  return breadcrumbList;
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "finds.ng",
    "url": "https://finds.ng.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://finds.ng.vercel.app/product?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
}

// Helper function to get full image URL
function getImageUrl(imagePath) {
  if (!imagePath) return null;
  // You'll need to implement this based on your image storage
  return `https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/${imagePath}`;
}

