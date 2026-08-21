import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { GalleryCategory, GalleryProject } from '../../types/gallery';

export const useGalleryCategories = () => {
  return useQuery<GalleryCategory[]>({
    queryKey: ['gallery-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useGalleryProjects = (categoryId?: string) => {
  return useQuery<GalleryProject[]>({
    queryKey: ['gallery-projects', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('gallery_projects')
        .select('*, media:gallery_project_media(*)')
        .order('order_index')
        .order('created_at', { ascending: false });
      
      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
};
