import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import SectionHeading from '../components/common/SectionHeading';
import { Download, X, ChevronLeft, ChevronRight, Camera, Video, Calendar, PenTool, LayoutGrid, Play, Image as ImageIcon } from 'lucide-react';
import { useGalleryCategories, useGalleryProjects } from '../lib/hooks/useGallery';
import { GalleryProject, GalleryProjectMedia } from '../types/gallery';
import { Skeleton } from '../components/ui/skeleton';

import OptimizedImage from '../components/common/OptimizedImage';

import LazyVideo from '../components/common/LazyVideo';
import { media, getPublicImageUrl } from '../lib/media';

const IconMap: Record<string, React.ReactNode> = {
  Camera: <Camera size={20} />,
  Video: <Video size={20} />,
  Calendar: <Calendar size={20} />,
  PenTool: <PenTool size={20} />,
  LayoutGrid: <LayoutGrid size={20} />,
};

interface MediaViewerProps {
  media: GalleryProjectMedia[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const getEmbedUrl = (url: string) => {
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/');
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('/').pop()?.split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
    const id = url.split('/').pop()?.split('?')[0];
    return `https://player.vimeo.com/video/${id}`;
  }
  if (url.includes('facebook.com') && url.includes('/videos/')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
  }
  return url;
};

const isEmbeddableVideo = (url: string) => {
  return url.includes('youtube.com') || 
         url.includes('youtu.be') || 
         url.includes('vimeo.com') || 
         (url.includes('facebook.com') && url.includes('/videos/'));
};

const MediaViewer: React.FC<MediaViewerProps> = ({
  media,
  currentIndex,
  onClose,
  onNext,
  onPrev
}) => {
  const currentMedia = media[currentIndex];
  if (!currentMedia) return null;
  const isVideo = currentMedia.type === 'video';
  const isEmbed = isEmbeddableVideo(currentMedia.url);

  const handleDownload = async () => {
    if (isEmbed) {
      window.open(currentMedia.url, '_blank');
      return;
    }
    try {
      const response = await fetch(currentMedia.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fokal-${currentMedia.caption?.toLowerCase().replace(/\s+/g, '-') || 'media'}${isVideo ? '.mp4' : '.jpg'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/95">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative z-10 max-w-7xl w-full bg-dark-900 rounded-xl overflow-hidden shadow-2xl">
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={handleDownload}
            className="p-2 bg-dark-800/80 backdrop-blur-sm rounded-full hover:bg-dark-700 transition-colors"
            title={isEmbed ? "Open video" : "Download media"}
          >
            <Download className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-dark-800/80 backdrop-blur-sm rounded-full hover:bg-dark-700 transition-colors"
            title="Close viewer"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="relative aspect-video flex items-center justify-center bg-black">
          {isVideo ? (
            isEmbed ? (
              <iframe
                src={getEmbedUrl(currentMedia.url)}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <LazyVideo
                src={currentMedia.url}
                controls
                autoPlay
                muted={false}
                className="max-w-full max-h-full"
              />
            )
          ) : (
            <OptimizedImage
              src={currentMedia.url}
              alt={currentMedia.caption}
              className="max-w-full max-h-full object-contain"
              width={1920}
              height={1080}
              lazy={false}
            />
          )}
        </div>

        <div className="p-6 bg-dark-800 border-t border-dark-700">
          <p className="text-white text-lg font-medium">{currentMedia.caption}</p>
        </div>

        {media.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-dark-800/80 backdrop-blur-sm rounded-full hover:bg-dark-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-dark-800/80 backdrop-blur-sm rounded-full hover:bg-dark-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentIndex === media.length - 1}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

interface ProjectSubGalleryProps {
  project: GalleryProject;
  onMediaClick: (mediaIndex: number) => void;
}

const ProjectSubGallery: React.FC<ProjectSubGalleryProps> = ({ project, onMediaClick }) => {
  if (!project.media || project.media.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Project Assets</h4>
        <span className="text-dark-400 text-xs font-medium">
          {project.media.length} {project.media.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {project.media.slice(0, 6).map((item, index) => (
            <div
              key={item.id}
              className="relative aspect-video cursor-pointer group overflow-hidden rounded-lg border border-dark-700/50"
              onClick={(e) => {
                e.stopPropagation();
                onMediaClick(index);
              }}
            >
              <OptimizedImage
                src={item.type === 'video' ? (item.thumbnail_url || project.image_url) : item.url}
                alt={item.caption || project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                width={400}
                height={225}
              />
              
              <div className="absolute top-2 left-2">
                {item.type === 'video' ? (
                  <div className="bg-accent-500/90 rounded-full p-1.5 shadow-lg">
                    <Play className="w-3 h-3 text-dark-900 fill-dark-900" />
                  </div>
                ) : (
                  <div className="bg-dark-950/60 backdrop-blur-sm rounded-full p-1.5 border border-white/10">
                    <ImageIcon className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              
              <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="scale-90 group-hover:scale-100 transition-transform">
                  {item.type === 'video' ? (
                    <Play className="w-8 h-8 text-white fill-white/20" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>
              
              {index === 5 && project.media.length > 6 && (

              <div className="absolute inset-0 bg-dark-950/80 flex items-center justify-center backdrop-blur-[2px]">
                <span className="text-accent-500 text-lg font-black">
                  +{project.media.length - 6}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectSkeleton = () => (
  <div className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700/30">
    <Skeleton className="aspect-[4/3] w-full" />
    <div className="p-6">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-16 w-full mb-6" />
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="aspect-video" />
        <Skeleton className="aspect-video" />
        <Skeleton className="aspect-video" />
      </div>
    </div>
  </div>
);

const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);

  const { data: categories = [], isLoading: isLoadingCats } = useGalleryCategories();
  const { data: projects = [], isLoading: isLoadingProjects } = useGalleryProjects(selectedCategory);

  const allCategories = [
    { id: 'all', name: 'All', icon_name: 'LayoutGrid' },
    ...categories
  ];

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const openProjectDetails = (projectId: number) => {
    setSelectedProjectId(projectId);
    document.body.style.overflow = 'hidden';
  };

  const closeProjectDetails = () => {
    setSelectedProjectId(null);
    setIsMediaViewerOpen(false);
    document.body.style.overflow = 'auto';
  };

  const openMediaViewer = (projectId: number, mediaIndex: number) => {
    setSelectedProjectId(projectId);
    setSelectedMediaIndex(mediaIndex);
    setIsMediaViewerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMediaViewer = () => {
    setIsMediaViewerOpen(false);
    document.body.style.overflow = 'auto';
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleNextMedia = () => {
    if (selectedProject?.media && selectedMediaIndex < selectedProject.media.length - 1) {
      setSelectedMediaIndex(prev => prev + 1);
    }
  };

  const handlePrevMedia = () => {
    if (selectedMediaIndex > 0) {
      setSelectedMediaIndex(prev => prev - 1);
    }
  };

  return (
    <PageTransition>
      <section className="relative flex items-center justify-center py-40 bg-dark-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/60 to-dark-950 z-10"></div>
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
              className="w-full h-full"
            >
              <OptimizedImage
                src={getPublicImageUrl(media.gallery.hero)}
                alt="Our Work"
                className="w-full h-full object-cover"
                lazy={false}
              />
            </motion.div>
          </div>


        <div className="container-custom relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-accent-500 font-bold tracking-[0.3em] uppercase mb-4"
          >
            Portfolio
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-white text-6xl md:text-8xl font-black mb-8"
          >
            Our Work<span className="text-accent-500">.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-dark-100 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed"
          >
            Capturing the essence of Papua New Guinea through premium visual storytelling and strategic brand development.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-dark-950">
        <div className="container-custom">
          <SectionHeading
            title="Project Showcase"
            subtitle="Filter our expertise across various disciplines and explore the detailed narratives behind each creative execution."
            centered
          />

          <div className="flex flex-wrap justify-center gap-3 mb-20">
            {isLoadingCats ? (
              Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-32 rounded-full" />)
            ) : (
              allCategories.map(category => (
                <button
                  key={category.id}
                  className={`flex items-center px-8 py-4 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-500 border-2 ${
                    selectedCategory === category.id
                      ? 'bg-accent-500 border-accent-500 text-dark-900 shadow-[0_0_20px_rgba(255,183,0,0.3)] scale-105'
                      : 'bg-transparent border-dark-700 text-dark-300 hover:border-accent-500/50 hover:text-white'
                  }`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {IconMap[category.icon_name] || <LayoutGrid size={20} />}
                  <span className="ml-3">{category.name}</span>
                </button>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {isLoadingProjects ? (
              Array(6).fill(0).map((_, i) => <ProjectSkeleton key={i} />)
            ) : projects.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-dark-400 text-xl">No projects found in this category.</p>
              </div>
            ) : (
              projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-dark-900/50 rounded-2xl overflow-hidden border border-dark-800/50 hover:border-accent-500/30 transition-all duration-500 flex flex-col h-full"
                >
                    <div 
                      className="relative cursor-pointer overflow-hidden aspect-[4/3]"
                      onClick={() => openProjectDetails(project.id)}
                    >
                      <OptimizedImage
                        src={project.image_url} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        width={600}
                        height={450}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-60"></div>

                    
                    {project.featured && (
                      <div className="absolute top-4 right-4 bg-accent-500 text-dark-900 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
                        Featured
                      </div>
                    )}
                    
                    <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-accent-500 text-[10px] font-black tracking-[0.2em] uppercase mb-2 block">
                        {categories.find(c => c.id === project.category_id)?.name || 'Project'}
                      </span>
                      <h4 className="text-white text-2xl font-bold leading-tight">{project.title}</h4>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 mb-6 text-dark-400 text-xs font-bold tracking-widest uppercase">
                      <span>{project.client}</span>
                      <span className="w-1 h-1 bg-dark-600 rounded-full"></span>
                      <span>{project.year}</span>
                    </div>
                    
                    <p className="text-dark-300 text-sm leading-relaxed mb-8 line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="mt-auto">
                      <ProjectSubGallery 
                        project={project} 
                        onMediaClick={(mediaIndex) => openMediaViewer(project.id, mediaIndex)}
                      />
                      
                      <button 
                        onClick={() => openProjectDetails(project.id)}
                        className="mt-8 flex items-center text-white text-xs font-black tracking-widest uppercase group/btn"
                      >
                        View Project Details
                        <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProjectId !== null && !isMediaViewerOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-10 bg-dark-950/95 backdrop-blur-md"
            onClick={closeProjectDetails}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-dark-900 rounded-3xl overflow-hidden max-w-6xl w-full max-h-[90vh] overflow-y-auto relative border border-dark-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
                <div className="relative h-96 md:h-[500px]">
                  <OptimizedImage 
                    src={selectedProject.image_url} 
                    alt={selectedProject.title} 
                    className="w-full h-full object-cover"
                    width={1200}
                    height={800}
                    lazy={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>

                <button 
                  className="absolute top-8 right-8 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-accent-500 hover:text-dark-900 transition-all z-20"
                  onClick={closeProjectDetails}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="px-8 md:px-16 pb-16 -mt-32 relative z-10">
                <div className="max-w-3xl">
                  <span className="text-accent-500 font-black tracking-widest uppercase text-xs mb-4 block">
                    {categories.find(c => c.id === selectedProject.category_id)?.name}
                  </span>
                  <h2 className="text-white text-4xl md:text-6xl font-black mb-8 leading-tight">
                    {selectedProject.title}
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-dark-800/50 p-6 rounded-2xl border border-dark-700/50">
                      <p className="text-dark-400 text-[10px] font-black uppercase tracking-widest mb-2">Client</p>
                      <p className="text-white font-bold">{selectedProject.client}</p>
                    </div>
                    <div className="bg-dark-800/50 p-6 rounded-2xl border border-dark-700/50">
                      <p className="text-dark-400 text-[10px] font-black uppercase tracking-widest mb-2">Year</p>
                      <p className="text-white font-bold">{selectedProject.year}</p>
                    </div>
                    <div className="bg-dark-800/50 p-6 rounded-2xl border border-dark-700/50">
                      <p className="text-dark-400 text-[10px] font-black uppercase tracking-widest mb-2">Category</p>
                      <p className="text-white font-bold capitalize">{selectedProject.category_id}</p>
                    </div>
                    <div className="bg-dark-800/50 p-6 rounded-2xl border border-dark-700/50">
                      <p className="text-dark-400 text-[10px] font-black uppercase tracking-widest mb-2">Location</p>
                      <p className="text-white font-bold">Papua New Guinea</p>
                    </div>
                  </div>
                  
                  <div className="prose prose-invert max-w-none mb-16">
                    <p className="text-dark-200 text-xl leading-relaxed font-light">
                      {selectedProject.description}
                    </p>
                  </div>
                </div>

                {selectedProject.media && selectedProject.media.length > 0 && (
                  <div className="mt-16 pt-16 border-t border-dark-800">
                    <h3 className="text-white text-3xl font-black mb-10 tracking-tight">Gallery Exploration</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {selectedProject.media.map((item, index) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ y: -5 }}
                          className="relative aspect-video cursor-pointer group overflow-hidden rounded-2xl border border-dark-800"
                          onClick={() => {
                            setSelectedMediaIndex(index);
                            setIsMediaViewerOpen(true);
                          }}
                        >
                          <img
                            src={item.type === 'video' ? (item.thumbnail_url || selectedProject.image_url) : item.url}
                            alt={item.caption}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            {item.type === 'video' ? <Play className="w-10 h-10 text-white" /> : <ImageIcon className="w-10 h-10 text-white" />}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMediaViewerOpen && selectedProject?.media && (
          <MediaViewer
            media={selectedProject.media}
            currentIndex={selectedMediaIndex}
            onClose={closeMediaViewer}
            onNext={handleNextMedia}
            onPrev={handlePrevMedia}
          />
        )}
      </AnimatePresence>

      <section className="py-32 bg-accent-500">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-dark-950 text-5xl md:text-7xl font-black mb-6 leading-tight">
                Let's Build Something Legendary Together.
              </h2>
              <p className="text-dark-900/80 text-xl md:text-2xl font-medium">
                Our team is ready to transform your ideas into world-class visual content. 
                Based in PNG, serving the globe.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <a href="/booking" className="px-10 py-6 bg-dark-950 text-white font-black tracking-widest uppercase rounded-full hover:bg-dark-900 transition-all shadow-2xl">
                Book a Session
              </a>
              <a href="/contact" className="px-10 py-6 bg-white text-dark-950 font-black tracking-widest uppercase rounded-full hover:bg-gray-100 transition-all shadow-xl">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default GalleryPage;
