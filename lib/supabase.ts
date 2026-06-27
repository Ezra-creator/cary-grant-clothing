import { createClient } from '@supabase/supabase-js'
import { validateEnvVars } from './env-validation'

// Validate environment variables
const { valid } = validateEnvVars()
if (!valid && process.env.NODE_ENV === 'production') {
  throw new Error('Missing or invalid environment variables. Check your configuration.')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const BUCKET_NAME = 'cg-product-upload'

export const uploadImageToSupabase = async (file: File): Promise<string> => {
  // Validate that the file is an image
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type, // Ensure correct MIME type is preserved
    })

  if (error) {
    console.error('Supabase upload error:', error)
    throw new Error(error.message)
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return publicUrlData.publicUrl
}
