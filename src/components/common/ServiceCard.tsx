import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  icon,
  link,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="card group hover:shadow-medium hover:-translate-y-1 p-6"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-900 mb-5 text-primary-500">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-dark-300 mb-5">{description}</p>
      <Link 
        to={link} 
        className="inline-flex items-center text-accent-500 font-medium group-hover:text-accent-400"
      >
        Learn more
        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
};

export default ServiceCard;