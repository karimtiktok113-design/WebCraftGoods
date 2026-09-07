/**
 * Utility for client-side image compression and resizing.
 * Converts large camera/desktop photos (multi-megabytes) into lightweight,
 * high-resolution JPEGs (~30KB - 70KB) that fit comfortably within Firestore
 * document size limits and transmit in milliseconds.
 */

export const compressImageFile = (
  file: File,
  maxDimension = 900,
  quality = 0.78
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error(`File "${file.name}" is not a valid image format.`));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Failed to read file "${file.name}".`));

    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result !== 'string') {
        return reject(new Error('Failed to parse file into data URL.'));
      }

      const img = new Image();
      img.onerror = () => reject(new Error(`Failed to decode image "${file.name}".`));

      img.onload = () => {
        try {
          let { width, height } = img;

          // Maintain aspect ratio while constraining maximum dimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback to original if 2D canvas is unavailable
            return resolve(result);
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to compressed JPEG data URL
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          // If canvas processing fails, fallback safely
          resolve(result);
        }
      };

      img.src = result;
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Estimates the byte size of a data URL or string
 */
export const getByteSize = (str: string): number => {
  return new Blob([str]).size;
};
