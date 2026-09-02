import { error } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import path from 'path';
import type { RequestHandler } from './$types';

const uploadDir = path.resolve('/user/profile/userIcons');

export const GET: RequestHandler = async ({ params }) => {
    const filePath = path.join(uploadDir, params.file);

    // prevent path traversal (../../etc/passwd etc)
    if (!filePath.startsWith(uploadDir)) {
        throw error(400, 'Invalid file path');
    }

    try {
        const data = await readFile(filePath);
        const ext = params.file.split('.').pop();
        const contentType =
            ext === 'png' ? 'image/png' :
            ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
            ext === 'webp' ? 'image/webp' :
            'application/octet-stream';

        return new Response(data, {
            headers: { 'Content-Type': contentType }
        });
    } catch {
        throw error(404, 'Not found');
    }
};