import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "FOKAL MULTIMEDIA | Videography, Photography & Branding",
  description = "FOKAL MULTIMEDIA specializes in professional videography, photography, events management, branding and content design services in Papua New Guinea.",
  image = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/81d62e3f-4b0f-4977-8ae3-57440ed0a25c/FOKAL-SOLUTIONS-LIMITED-131-resized-1770007366145.webp?width=8000&height=8000&resize=contain",
  url = "https://fokalltd.com/",
  type = "website"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="FOKAL MULTIMEDIA" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="keywords" content="videography, photography, branding, events management, content design, Papua New Guinea, PNG, multimedia, professional services" />
      <meta name="author" content="FOKAL MULTIMEDIA" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEOHead;