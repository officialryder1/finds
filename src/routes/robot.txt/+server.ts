export function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://finds.ng.vercel.app/sitemap.xml`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}