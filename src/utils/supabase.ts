// Supabase image helper functions
import { getPublicImageUrl } from '../lib/media';

export const getSupabaseImageUrl = (imagePath: string): string => {
  return getPublicImageUrl(imagePath);
};

export const getImageUrl = (imagePath: string, _isPublic: boolean = true): string => {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return getPublicImageUrl(imagePath);
};
