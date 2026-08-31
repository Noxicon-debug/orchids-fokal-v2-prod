import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { Plus, Trash2, Edit2, Upload, X, Save, Image as ImageIcon, Loader2, ChevronLeft, LogOut } from 'lucide-react';
import { useGalleryCategories, useGalleryProjects } from '../lib/hooks/useGallery';
import { useAdminMutations } from '../lib/hooks/useAdmin';
import { useAuth } from '../lib/hooks/useAuth';
import { GalleryProject } from '../types/gallery';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';

const AdminPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Partial<GalleryProject> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const { data: categories = [] } = useGalleryCategories();
  const { data: projects = [], isLoading } = useGalleryProjects('all');
  const adminMutations = useAdminMutations();

  const handleAddProject = () => {
    setSelectedProject({
      title: '',
      category_id: categories[0]?.id || '',
      client: '',
      year: new Date().getFullYear().toString(),
      description: '',
      image_url: '',
      featured: false,
    });
    setIsEditing(true);
  };

  const handleEditProject = (project: GalleryProject) => {
    setSelectedProject(project);
    setIsEditing(true);
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await adminMutations.deleteProject.mutateAsync(id);
        toast.success('Project deleted successfully');
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject?.title) return;

    try {
      if (selectedProject.id) {
        await adminMutations.updateProject.mutateAsync(selectedProject as GalleryProject & { id: number });
        toast.success('Project updated successfully');
      } else {
        await adminMutations.addProject.mutateAsync(selectedProject as Omit<GalleryProject, 'id' | 'created_at'>);
        toast.success('Project added successfully');
      }
      setIsEditing(false);
      setSelectedProject(null);
    } catch (err) {
      toast.error('Failed to save project');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'media') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await adminMutations.uploadFile(file, 'gallery-uploads');
      if (type === 'cover') {
        setSelectedProject(prev => ({ ...prev, image_url: url }));
      } else if (selectedProject?.id) {
        await adminMutations.addMedia.mutateAsync({
          project_id: selectedProject.id,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          url: url,
          thumbnail_url: null,
          caption: file.name,
          order_index: (selectedProject.media?.length || 0)
        });
        toast.success('Media added successfully');
      }
      toast.success('File uploaded successfully');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    try {
      await adminMutations.deleteMedia.mutateAsync(mediaId);
      toast.success('Media deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-dark-950 pt-32 pb-20">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-white text-4xl font-black mb-2">Content Management</h1>
              <p className="text-dark-400">Manage your portfolio projects and gallery assets.</p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-dark-500 text-sm hidden md:block">{user.email}</span>
              )}
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="border-dark-700 text-dark-300 hover:text-white hover:border-red-500/50 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              {!isEditing && (
                <Button
                  onClick={handleAddProject}
                  className="bg-accent-500 hover:bg-accent-600 text-dark-900 font-bold px-8"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Project
                </Button>
              )}
            </div>
          </div>

          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <Card className="lg:col-span-2 bg-dark-900 border-dark-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    {selectedProject?.id ? 'Edit Project' : 'Create Project'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProject} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-dark-200">Project Title</Label>
                        <Input 
                          value={selectedProject?.title}
                          onChange={e => setSelectedProject(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Corporate Brand Video"
                          className="bg-dark-800 border-dark-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-dark-200">Category</Label>
                        <Select 
                          value={selectedProject?.category_id}
                          onValueChange={val => setSelectedProject(prev => ({ ...prev, category_id: val }))}
                        >
                          <SelectTrigger className="bg-dark-800 border-dark-700 text-white">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-dark-800 border-dark-700">
                            {categories.map(cat => (
                              <SelectItem key={cat.id} value={cat.id} className="text-white hover:bg-dark-700">
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-dark-200">Client Name</Label>
                        <Input 
                          value={selectedProject?.client}
                          onChange={e => setSelectedProject(prev => ({ ...prev, client: e.target.value }))}
                          placeholder="e.g. TWM Ltd"
                          className="bg-dark-800 border-dark-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-dark-200">Project Year</Label>
                        <Input 
                          value={selectedProject?.year}
                          onChange={e => setSelectedProject(prev => ({ ...prev, year: e.target.value }))}
                          placeholder="2025"
                          className="bg-dark-800 border-dark-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-dark-200">Description</Label>
                      <Textarea 
                        value={selectedProject?.description}
                        onChange={e => setSelectedProject(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the project..."
                        className="bg-dark-800 border-dark-700 text-white min-h-[120px]"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="featured" 
                        checked={selectedProject?.featured}
                        onCheckedChange={checked => setSelectedProject(prev => ({ ...prev, featured: !!checked }))}
                        className="border-accent-500 data-[state=checked]:bg-accent-500"
                      />
                      <Label htmlFor="featured" className="text-white">Feature this project on homepage</Label>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <Button type="submit" className="bg-accent-500 hover:bg-accent-600 text-dark-900 font-bold px-8">
                        <Save className="w-4 h-4 mr-2" />
                        Save Project
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border-dark-700 text-dark-300 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card className="bg-dark-900 border-dark-800">
                  <CardHeader>
                    <CardTitle className="text-white">Cover Image</CardTitle>
                    <CardDescription className="text-dark-400">This is the primary image shown in the gallery list.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-dark-800 border-2 border-dashed border-dark-700 flex items-center justify-center">
                      {selectedProject?.image_url ? (
                        <>
                          <img src={selectedProject.image_url} alt="Cover" className="w-full h-full object-cover" />
                          <button 
                            className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white"
                            onClick={() => setSelectedProject(prev => ({ ...prev, image_url: '' }))}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-6">
                          {isUploading ? (
                            <Loader2 className="w-8 h-8 text-accent-500 animate-spin mx-auto mb-2" />
                          ) : (
                            <Upload className="w-8 h-8 text-dark-600 mx-auto mb-2" />
                          )}
                          <p className="text-dark-400 text-sm mb-4">Click to upload cover image</p>
                          <Input 
                            type="file" 
                            className="hidden" 
                            id="cover-upload" 
                            accept="image/*"
                            onChange={e => handleFileUpload(e, 'cover')}
                            disabled={isUploading}
                          />
                          <Button 
                            variant="outline" 
                            asChild
                            disabled={isUploading}
                            className="border-dark-700 text-dark-300"
                          >
                            <label htmlFor="cover-upload" className="cursor-pointer">Browse Files</label>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {selectedProject?.id && (
                  <Card className="bg-dark-900 border-dark-800">
                    <CardHeader>
                      <CardTitle className="text-white">Project Assets</CardTitle>
                      <CardDescription className="text-dark-400">Additional images and videos for the project sub-gallery.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {selectedProject.media?.map(m => (
                          <div key={m.id} className="relative aspect-video rounded-lg overflow-hidden group">
                            <img src={m.type === 'video' ? (m.thumbnail_url || selectedProject.image_url) : m.url} alt={m.caption} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                onClick={() => handleDeleteMedia(m.id)}
                                className="p-2 bg-red-500 text-white rounded-full"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-4">
                        <Input 
                          type="file" 
                          className="hidden" 
                          id="media-upload" 
                          accept="image/*,video/*"
                          onChange={e => handleFileUpload(e, 'media')}
                          disabled={isUploading}
                        />
                        <Button 
                          className="w-full bg-dark-800 border-dark-700 text-white hover:bg-dark-700"
                          asChild
                          disabled={isUploading}
                        >
                          <label htmlFor="media-upload" className="cursor-pointer">
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Add Asset
                          </label>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="bg-dark-900 border-dark-800 animate-pulse">
                    <div className="aspect-[4/3] bg-dark-800" />
                    <CardHeader>
                      <div className="h-6 w-3/4 bg-dark-800 rounded" />
                    </CardHeader>
                  </Card>
                ))
              ) : (
                projects.map(project => (
                  <Card key={project.id} className="bg-dark-900 border-dark-800 hover:border-accent-500/50 transition-all group overflow-hidden">
                    <div className="relative aspect-[4/3]">
                      <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-transparent opacity-60" />
                      <div className="absolute top-3 right-3 flex gap-2">
                        {project.featured && (
                          <div className="bg-accent-500 text-dark-900 text-[10px] font-black px-2 py-1 rounded">FEATURED</div>
                        )}
                        <div className="bg-dark-900/80 text-white text-[10px] font-black px-2 py-1 rounded uppercase">
                          {project.category_id}
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-white text-xl line-clamp-1">{project.title}</CardTitle>
                      <CardDescription className="text-dark-400">{project.client} • {project.year}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center pt-0">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-dark-300 hover:text-white hover:bg-dark-800"
                          onClick={() => handleEditProject(project)}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                      <div className="flex items-center text-dark-500 text-xs">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        {project.media?.length || 0}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
          
          <div className="mt-20 pt-12 border-t border-dark-800 flex justify-between items-center">
            <Button variant="ghost" className="text-dark-400 hover:text-white" asChild>
              <a href="/">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Site
              </a>
            </Button>
            <p className="text-dark-600 text-xs font-medium tracking-widest uppercase">FOKAL CMS v1.0</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminPage;
