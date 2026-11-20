import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, logActivity } from '@/lib/auth';
import { Media } from '@/models/Media';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';
    const altText = (formData.get('altText') as string) || '';

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name) || '.png';
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    const media = await Media.create({
      filename,
      originalName: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      url: publicUrl,
      folder,
      altText,
      uploadedBy: user._id
    });

    await logActivity(user, 'UPLOAD', 'media', media._id, `Uploaded file ${file.name}`, req);

    return NextResponse.json({
      success: true,
      message: 'Media uploaded successfully',
      media
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
