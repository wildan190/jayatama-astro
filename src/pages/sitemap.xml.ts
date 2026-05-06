import type { APIRoute } from 'astro';
import dbConnect from '../lib/db';
import { CustomPage, Product } from '../lib/models';

export const GET: APIRoute = async () => {
  await dbConnect();
  const pages = await CustomPage.find({ status: 'published' });
  const products = await Product.find();

  const baseUrl = 'https://jayatamaborepile.com';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
  </url>
  ${pages.map(p => `
  <url>
    <loc>${baseUrl}/${p.slug === 'index' ? '' : p.slug}</loc>
  </url>`).join('')}
  ${products.map(p => `
  <url>
    <loc>${baseUrl}/products/${p.slug || p._id}</loc>
  </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
};
