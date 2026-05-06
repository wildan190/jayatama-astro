import dbConnect from '../../../lib/db';
import { CustomPage } from '../../../lib/models';
import type { APIRoute } from 'astro';

export const PUT: APIRoute = async ({ params, request }) => {
  await dbConnect();
  const { id } = params;
  const data = await request.json();

  try {
    // If this page is set as home, unset other home pages
    if (data.isHome) {
      await CustomPage.updateMany({ _id: { $ne: id } }, { isHome: false });
    }

    const updatedPage = await CustomPage.findByIdAndUpdate(id, data, { new: true });
    return new Response(JSON.stringify(updatedPage), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update page' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  await dbConnect();
  const { id } = params;

  try {
    await CustomPage.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: 'Page deleted' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete page' }), { status: 500 });
  }
};
