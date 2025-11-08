# Cloudinary Setup Guide

## Environment Variables

Add these to your `.env` file or Koyeb environment variables:

### Required (for unsigned uploads with preset):
```
CLOUDINARY_CLOUD_NAME=dtzghowyh
CLOUDINARY_UPLOAD_PRESET=upload
```

### Optional (for signed uploads - more secure):
```
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### Next.js Public Variables (if needed in client-side):
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dtzghowyh
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=upload
NEXT_PUBLIC_IMAGE_BASE_URL=https://res.cloudinary.com/dtzghowyh/image/upload/
```

## Setup Instructions

1. **Get your Cloudinary credentials:**
   - Go to https://cloudinary.com/console
   - Sign in to your account
   - Go to Settings → Access Keys
   - Copy your `Cloud Name`, `API Key`, and `API Secret`

2. **Configure Upload Preset:**
   - Go to Settings → Upload
   - Create or edit an upload preset named "upload"
   - Set it to "Unsigned" if you want to use it without API secret
   - Or keep it "Signed" and use API credentials

3. **Add to Koyeb:**
   - Go to your Koyeb service settings
   - Add environment variables:
     - `CLOUDINARY_CLOUD_NAME=dtzghowyh`
     - `CLOUDINARY_UPLOAD_PRESET=upload`
     - `CLOUDINARY_API_KEY=your_key` (optional)
     - `CLOUDINARY_API_SECRET=your_secret` (optional)

4. **Test the upload:**
   - Try uploading an image in the admin panel
   - Check that it appears in Cloudinary dashboard
   - Verify the image URL is returned correctly

## Notes

- If using unsigned upload preset, you don't need API_KEY and API_SECRET
- Images are stored in `gsccapital` folder in Cloudinary
- All images are automatically optimized by Cloudinary
- Images are served via CDN for fast loading

