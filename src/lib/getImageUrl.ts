import { supabase } from '$lib/supabaseClient';

export function getImageUrl(imagePath) {
    if (!imagePath) return null
    const { data } = supabase.storage.from('product-images').getPublicUrl(imagePath)
    return data.publicUrl
  }