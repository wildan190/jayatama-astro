import type { APIRoute } from 'astro';
import dbConnect from '../../../lib/db';
import { CustomPage } from '../../../lib/models';

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    await dbConnect();
    await CustomPage.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: 'Page deleted' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as any).message }), { status: 500 });
  }
};
