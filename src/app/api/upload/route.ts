import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dtzghowyh';
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Only configure if API credentials are provided (for signed uploads)
// For unsigned uploads, we only need the upload preset
if (apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
} else {
  // For unsigned uploads, we still need to set cloud_name
  cloudinary.config({
    cloud_name: cloudName,
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64 string
    const base64String = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'upload';
    
    let result;
    if (apiKey && apiSecret) {
      // Signed upload (with API credentials)
      result = await cloudinary.uploader.upload(dataURI, {
        upload_preset: uploadPreset,
        folder: 'gsccapital',
        resource_type: 'image',
      });
    } else {
      // Unsigned upload (using upload preset only - no API secret needed)
      result = await cloudinary.uploader.upload(dataURI, {
        upload_preset: uploadPreset,
        folder: 'gsccapital',
        resource_type: 'image',
        unsigned: true,
      });
    }

    // Return the secure URL
    const imageUrl = result.secure_url;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
