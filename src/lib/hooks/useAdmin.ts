import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { GalleryProject, GalleryProjectMedia } from '../../types/gallery';

export const useAdminMutations = () => {
  const queryClient = useQueryClient();

  const addProject = useMutation({
    mutationFn: async (project: Omit<GalleryProject, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('gallery_projects')
        .insert(project)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-projects'] });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GalleryProject> & { id: number }) => {
      const { data, error } = await supabase
        .from('gallery_projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-projects'] });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('gallery_projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-projects'] });
    },
  });

  const addMedia = useMutation({
    mutationFn: async (media: Omit<GalleryProjectMedia, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('gallery_project_media')
        .insert(media)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-projects'] });
    },
  });

  const deleteMedia = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('gallery_project_media')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-projects'] });
    },
  });

  const uploadFile = async (file: File, path: string) => {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const fullPath = `${path}/${fileName}`;

    const { error } = await supabase.storage
      .from('gallery')
      .upload(fullPath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(fullPath);

    return publicUrl;
  };

  return {
    addProject,
    updateProject,
    deleteProject,
    addMedia,
    deleteMedia,
    uploadFile
  };
};
