/**
 * Cloudinary Image Optimization Helper
 * Adds transformation parameters to Cloudinary image URLs for better quality and performance
 */

export function optimizeCloudinaryImage(
  imageUrl: string | undefined | null,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale';
    dpr?: 'auto' | number;
  } = {}
): string {
  if (!imageUrl) return '';

  // If it's not a Cloudinary URL, return as is
  if (!imageUrl.includes('res.cloudinary.com')) {
    return imageUrl;
  }

  // Parse the Cloudinary URL
  // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{version}/{public_id}.{format}
  const urlParts = imageUrl.split('/upload/');
  
  if (urlParts.length !== 2) {
    return imageUrl; // Invalid Cloudinary URL
  }

  const baseUrl = urlParts[0] + '/upload/';
  const pathAndFile = urlParts[1];

  // Build transformation string
  const transformations: string[] = [];

  // Quality
  if (options.quality) {
    transformations.push(`q_${options.quality}`);
  } else {
    transformations.push('q_auto'); // Auto quality for best balance
  }

  // Format
  if (options.format) {
    transformations.push(`f_${options.format}`);
  } else {
    transformations.push('f_auto'); // Auto format (WebP, AVIF when supported)
  }

  // Dimensions
  if (options.width) {
    transformations.push(`w_${options.width}`);
  }
  if (options.height) {
    transformations.push(`h_${options.height}`);
  }

  // Crop mode
  if (options.crop) {
    transformations.push(`c_${options.crop}`);
  } else if (options.width || options.height) {
    transformations.push('c_fill'); // Fill container when dimensions specified
  }

  // Device Pixel Ratio
  if (options.dpr) {
    transformations.push(`dpr_${options.dpr}`);
  } else {
    transformations.push('dpr_auto'); // Auto DPR for retina displays
  }

  // Combine transformations
  const transformationString = transformations.join(',');
  
  return `${baseUrl}${transformationString}/${pathAndFile}`;
}

/**
 * Optimize image for company cards (full width, ~300px height)
 */
export function optimizeCompanyImage(imageUrl: string | undefined | null): string {
  return optimizeCloudinaryImage(imageUrl, {
    width: 600, // 2x for retina on larger cards
    height: 400,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
    dpr: 'auto',
  });
}

/**
 * Optimize image for statistics (48x48px)
 */
export function optimizeStatisticImage(imageUrl: string | undefined | null): string {
  return optimizeCloudinaryImage(imageUrl, {
    width: 96, // 2x for retina
    height: 96,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
    dpr: 'auto',
  });
}

/**
 * Optimize image for services (40x40px)
 */
export function optimizeServiceImage(imageUrl: string | undefined | null): string {
  return optimizeCloudinaryImage(imageUrl, {
    width: 80, // 2x for retina
    height: 80,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
    dpr: 'auto',
  });
}

/**
 * Optimize image for preview (128x128px)
 */
export function optimizePreviewImage(imageUrl: string | undefined | null): string {
  return optimizeCloudinaryImage(imageUrl, {
    width: 256, // 2x for retina
    height: 256,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
    dpr: 'auto',
  });
}

