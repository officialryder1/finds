import { supabase } from '$lib/supabaseClient';

export async function GET() {
  const baseUrl = 'https://findsng.vercal.app';
  
  // Fetch all active products
  const { data: products } = await supabase
    .from('products')
    .select('id, updated_at')
    .eq('is_active', true);
  
  // Fetch all active categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .eq('is_active', true);

  const pages = [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/products', priority: 0.9, changefreq: 'weekly' },
    { url: '/new-arrivals', priority: 0.9, changefreq: 'daily' },
    { url: '/categories', priority: 0.8, changefreq: 'monthly' }
  ];

  // Add category pages
  categories?.forEach(category => {
    pages.push({
      url: `/productss?category=${category.slug}`,
      priority: 0.7,
      changefreq: 'weekly'
    });
  });

  // Add product pages
  products?.forEach(product => {
    pages.push({
      url: `/products/${product.id}`,
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: product.updated_at
    });
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}