export function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://findsng.vercel.app/sitemap.xml`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}