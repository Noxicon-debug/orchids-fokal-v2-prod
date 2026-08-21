export interface GalleryCategory {
  id: string;
  name: string;
  icon_name: string;
}

export interface GalleryProjectMedia {
  id: number;
  project_id: number;
  type: 'image' | 'video';
  url: string;
  thumbnail_url: string | null;
  caption: string;
  order_index: number;
}

export interface GalleryProject {
  id: number;
  title: string;
  category_id: string;
  client: string;
  year: string;
  description: string;
  image_url: string;
  featured: boolean;
  media?: GalleryProjectMedia[];
}
