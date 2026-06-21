// Shared Cloudinary unsigned-upload helper (free 25GB tier).
const CLOUD_NAME   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED   = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

/**
 * Uploads an image to Cloudinary. Validates type/size client-side first.
 * @throws Error with a Thai user-facing message on invalid input or failure.
 */
export async function uploadImage(file: File, folder = 'uploads'): Promise<string> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error('ไฟล์ต้องเป็นรูปภาพ (JPG, PNG, WEBP)')
  }
  if (file.size > MAX_BYTES) {
    throw new Error('ไฟล์ใหญ่เกินไป (จำกัด 5 MB)')
  }

  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('folder', folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: fd,
  })
  if (!res.ok) throw new Error('อัปโหลดไม่สำเร็จ กรุณาลองใหม่')
  const data = await res.json()
  return data.secure_url as string
}
