/**
 * Technology KSA - Image Storage Manager
 * نظام إدارة الصور المحسّن باستخدام IndexedDB
 * يحل مشكلة Data URLs الطويلة في localStorage
 */

class ImageStorageManager {
  constructor() {
    this.dbName = 'techksa_images_db';
    this.storeName = 'images';
    this.db = null;
    this.maxImageSize = 1920; // Max width/height for compression
    this.quality = 0.85; // JPEG quality
  }

  /**
   * Initialize IndexedDB
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id' });
          objectStore.createIndex('name', 'name', { unique: false });
          objectStore.createIndex('uploadDate', 'uploadDate', { unique: false });
        }
      };
    });
  }

  /**
   * Compress image before storing
   */
  async compressImage(file, maxSize = this.maxImageSize, quality = this.quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          // Calculate new dimensions
          let width = img.width;
          let height = img.height;

          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }

          // Create canvas and compress
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob
          canvas.toBlob((blob) => {
            if (blob) {
              resolve({
                blob: blob,
                width: width,
                height: height,
                originalSize: file.size,
                compressedSize: blob.size,
                compressionRatio: ((1 - blob.size / file.size) * 100).toFixed(1)
              });
            } else {
              reject(new Error('فشل ضغط الصورة'));
            }
          }, 'image/jpeg', quality);
        };

        img.onerror = () => reject(new Error('فشل تحميل الصورة'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('فشل قراءة الملف'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Create thumbnail for preview
   */
  async createThumbnail(blob, maxSize = 300) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((thumbnailBlob) => {
          URL.revokeObjectURL(url);
          resolve(thumbnailBlob);
        }, 'image/jpeg', 0.7);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('فشل إنشاء المعاينة'));
      };

      img.src = url;
    });
  }

  /**
   * Store image in IndexedDB
   */
  async storeImage(file, options = {}) {
    try {
      // Compress image
      const compressed = await this.compressImage(file, options.maxSize, options.quality);

      // Create thumbnail
      const thumbnail = await this.createThumbnail(compressed.blob);

      // Create image metadata
      const imageData = {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        alt: options.alt || file.name.replace(/\.[^/.]+$/, ''),
        originalBlob: compressed.blob,
        thumbnail: thumbnail,
        width: compressed.width,
        height: compressed.height,
        originalSize: compressed.originalSize,
        compressedSize: compressed.compressedSize,
        compressionRatio: compressed.compressionRatio,
        uploadDate: new Date().toISOString(),
        tags: options.tags || []
      };

      // Store in IndexedDB
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);

      return new Promise((resolve, reject) => {
        const request = objectStore.add(imageData);

        request.onsuccess = () => {
          // Return metadata without blobs for localStorage reference
          const metadata = {
            id: imageData.id,
            name: imageData.name,
            alt: imageData.alt,
            width: imageData.width,
            height: imageData.height,
            originalSize: imageData.originalSize,
            compressedSize: imageData.compressedSize,
            compressionRatio: imageData.compressionRatio,
            uploadDate: imageData.uploadDate,
            tags: imageData.tags,
            url: `idb://${imageData.id}` // Virtual URL pointing to IndexedDB
          };

          resolve(metadata);
        };

        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      throw new Error(`فشل حفظ الصورة: ${error.message}`);
    }
  }

  /**
   * Get image from IndexedDB
   */
  async getImage(imageId, thumbnail = false) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.get(imageId);

      request.onsuccess = () => {
        if (request.result) {
          const blob = thumbnail ? request.result.thumbnail : request.result.originalBlob;
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject(new Error('الصورة غير موجودة'));
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all images metadata
   */
  async getAllImages() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        // Return only metadata without blobs
        const metadata = request.result.map(img => ({
          id: img.id,
          name: img.name,
          alt: img.alt,
          width: img.width,
          height: img.height,
          originalSize: img.originalSize,
          compressedSize: img.compressedSize,
          compressionRatio: img.compressionRatio,
          uploadDate: img.uploadDate,
          tags: img.tags,
          url: `idb://${img.id}`
        }));

        resolve(metadata);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete image from IndexedDB
   */
  async deleteImage(imageId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(imageId);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Update image metadata
   */
  async updateImageMetadata(imageId, updates) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const getRequest = objectStore.get(imageId);

      getRequest.onsuccess = () => {
        const imageData = getRequest.result;

        if (imageData) {
          // Update allowed fields
          if (updates.alt !== undefined) imageData.alt = updates.alt;
          if (updates.tags !== undefined) imageData.tags = updates.tags;

          const updateRequest = objectStore.put(imageData);

          updateRequest.onsuccess = () => resolve(true);
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('الصورة غير موجودة'));
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Get storage size info
   */
  async getStorageInfo() {
    const images = await this.getAllImages();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        let totalOriginalSize = 0;
        let totalCompressedSize = 0;

        request.result.forEach(img => {
          totalOriginalSize += img.originalSize;
          totalCompressedSize += img.compressedSize;
        });

        resolve({
          count: images.length,
          totalOriginalSize: totalOriginalSize,
          totalCompressedSize: totalCompressedSize,
          totalSaved: totalOriginalSize - totalCompressedSize,
          savedPercentage: totalOriginalSize > 0
            ? ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1)
            : 0
        });
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all images (use with caution!)
   */
  async clearAll() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Helper: Format bytes to human readable
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Migrate old Data URL images to IndexedDB
   */
  async migrateFromDataURLs(mediaArray) {
    const migrated = [];
    const failed = [];

    for (const media of mediaArray) {
      try {
        // Check if it's a Data URL
        if (media.url && media.url.startsWith('data:image/')) {
          // Convert Data URL to Blob
          const response = await fetch(media.url);
          const blob = await response.blob();

          // Create a File object from blob
          const file = new File([blob], media.name || 'image.jpg', { type: blob.type });

          // Store in IndexedDB
          const stored = await this.storeImage(file, { alt: media.alt });

          migrated.push({
            oldId: media.id,
            newId: stored.id,
            name: stored.name,
            url: stored.url,
            originalSize: media.url.length, // Data URL length
            newSize: stored.compressedSize
          });
        }
      } catch (error) {
        failed.push({
          id: media.id,
          name: media.name,
          error: error.message
        });
      }
    }

    return { migrated, failed };
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.ImageStorageManager = ImageStorageManager;
}
