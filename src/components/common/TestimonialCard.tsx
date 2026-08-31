import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  imageUrl: string;
  rating: number;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  name, 
  role, 
  content, 
  imageUrl,
  rating,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card p-6"
    >
      <div className="flex space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={`${i < rating ? 'text-accent-500 fill-accent-500' : 'text-dark-700'}`}
          />
        ))}
      </div>
      <p className="text-dark-200 mb-6">"{content}"</p>
      <div className="flex items-center">
        <OptimizedImage
          src={imageUrl}
          alt={name} 
          className="w-12 h-12 rounded-full object-cover mr-4"
          width={48}
          height={48}
          quality={75}
        />
        <div>
          <h4 className="font-semibold text-white">{name}</h4>
          <p className="text-dark-400 text-sm">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;