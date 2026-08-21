import React from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from './OptimizedImage';

interface ProjectCardProps {
  title: string;
  category: string;
  imageUrl: string;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title, 
  category, 
  imageUrl,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg"
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        <OptimizedImage
          src={imageUrl}
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          width={400}
          height={300}
          quality={80}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <span className="text-accent-500 text-sm font-medium">{category}</span>
        <h3 className="text-white font-semibold text-xl mt-1">{title}</h3>
      </div>
    </motion.div>
  );
};

export default ProjectCard;