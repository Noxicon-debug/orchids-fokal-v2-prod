import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  gradientTitle?: boolean;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  title, 
  subtitle, 
  centered = false,
  gradientTitle = false
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <h2 className={`font-bold ${gradientTitle ? 'text-gradient' : 'text-white'}`}>
        {title}
        {!gradientTitle && <span className="text-accent-500">.</span>}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg md:text-xl text-dark-300 max-w-3xl ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;