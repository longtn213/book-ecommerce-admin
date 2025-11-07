export const uploadToCloudinary = async (
  file: File,
  folder: string = 'book_ecommerce'
): Promise<string | null> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!file || !cloudName || !uploadPreset) {
    console.error('❌ Cloudinary config is missing!');
    return null;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      console.error('❌ Cloudinary upload failed:', await res.text());
      return null;
    }

    const data = await res.json();
    return data.secure_url || null;
  } catch (error) {
    console.error('❌ Upload error:', error);
    return null;
  }
};
