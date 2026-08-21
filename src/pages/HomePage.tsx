import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import SectionHeading from '../components/common/SectionHeading';
import ServiceCard from '../components/common/ServiceCard';
import ProjectCard from '../components/common/ProjectCard';
import ClientsSection from '../components/common/ClientsSection';
import OptimizedImage from '../components/common/OptimizedImage';
import LazyVideo from '../components/common/LazyVideo';
import { Camera, Video, Calendar, PenTool, LayoutGrid, ArrowRight } from 'lucide-react';
import { media, getPublicImageUrl } from '../lib/media';

const services = [
  {
    title: 'Videography',
    description: 'Professional video production for commercials, corporate videos, events, and more.',
    icon: <Video size={24} />,
    link: '/services#videography'
  },
  {
    title: 'Photography',
    description: 'Stunning photography for portraits, products, events, and commercial use.',
    icon: <Camera size={24} />,
    link: '/services#photography'
  },
  {
    title: 'Events Management',
    description: 'Full-service event planning and management for corporate and private events.',
    icon: <Calendar size={24} />,
    link: '/services#events'
  },
  {
    title: 'Branding & Design',
    description: 'Creative branding solutions including logo design, brand identity, and guidelines.',
    icon: <PenTool size={24} />,
    link: '/services#branding'
  },
  {
    title: 'Content Creation',
    description: 'Engaging content creation for social media, websites, and marketing campaigns.',
    icon: <LayoutGrid size={24} />,
    link: '/services#content'
  }
];

const projects = media.home.featuredProjects.map((p) => ({
  title: p.title,
  category: p.category,
  imageUrl: getPublicImageUrl(p.image),
}));

const HomePage: React.FC = () => {
  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-dark-950/70 z-10"></div>
          <LazyVideo
            src="https://player.vimeo.com/external/459818474.sd.mp4?s=4e32fa4ce2c9f2b6ed63d94bc8f446f31e283f8f&profile_id=139&oauth2_token_id=57447761"
            poster={getPublicImageUrl(media.home.heroPoster)}
            className="w-full h-full"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

          <div className="container-custom relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-white mb-6 font-display font-extrabold tracking-tight text-5xl md:text-7xl lg:text-8xl"
            >
              Capturing Stories <br />
              <span className="text-gradient drop-shadow-sm">Through Visuals</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-dark-100 text-lg md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed font-light"
            >
              FOKAL SOLUTIONS LTD specializes in creating compelling visual content
              that brings your vision to life with expert videography, photography, and design.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-5 justify-center"
            >
              <Link to="/services" className="btn btn-accent px-10 py-4 text-lg shadow-lg hover:shadow-accent-500/20 transform hover:-translate-y-1 transition-all duration-300">
                Explore Services
              </Link>
              <Link to="/booking" className="btn bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-10 py-4 text-lg transform hover:-translate-y-1 transition-all duration-300">
                Book Now
              </Link>
            </motion.div>
          </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="w-8 h-12 border-2 border-white rounded-full flex items-start justify-center p-1"
          >
            <motion.div
              animate={{ 
                y: [0, 10, 0],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: "loop" 
              }}
              className="w-1 h-3 bg-white rounded-full"
            />
          </motion.div>
        </div>
      </section>

        {/* Services Section */}
        <section className="section bg-dark-900 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-dark-950 to-transparent opacity-50"></div>
          <div className="container-custom relative z-10">
            <SectionHeading
              title="Our Services"
              subtitle="We offer a comprehensive range of multimedia services to bring your vision to life with creativity and precision."
              centered
              gradientTitle
            />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                icon={service.icon}
                link={service.link}
                delay={index}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="btn btn-primary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section bg-dark-950">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-white mb-6">
                Creating Visual Excellence<span className="text-accent-500">.</span>
              </h2>
              <p className="text-dark-300 mb-6">
                FOKAL MULTIMEDIA was founded with a passion for visual storytelling and a commitment to excellence. We believe that every brand, event, and moment deserves to be captured and presented in its best light.
              </p>
              <p className="text-dark-300 mb-8">
                Our team of creative professionals brings together expertise in videography, photography, event management, branding, and content design to deliver comprehensive multimedia solutions that exceed expectations.
              </p>
              <Link to="/about" className="btn btn-accent">
                Learn About Us
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-video rounded-xl overflow-hidden shadow-hard">
                <OptimizedImage
                  src={getPublicImageUrl(media.home.aboutImage)}
                  alt="Team at work" 
                  className="w-full h-full object-cover"
                  width={600}
                  height={400}
                  quality={85}
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-accent-500 rounded-lg p-5 w-32 h-32 flex flex-col items-center justify-center shadow-hard">
                <span className="text-dark-900 font-display font-bold text-3xl">20+</span>
                <span className="text-dark-900 font-medium text-sm">Years of Excellence</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <ClientsSection />

      {/* Portfolio Section */}
      <section className="section bg-dark-900">
        <div className="container-custom">
          <SectionHeading
            title="Featured Projects"
            subtitle="Explore our portfolio of work across various industries and services."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                category={project.category}
                imageUrl={project.imageUrl}
                index={index}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/gallery" className="inline-flex items-center text-accent-500 font-medium hover:text-accent-400">
              View Full Portfolio
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      
        {/* CTA Section */}
        <section className="section mesh-gradient relative overflow-hidden py-24">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent"></div>
          <div className="container-custom relative z-10">
            <div className="text-center max-w-3xl mx-auto glass p-8 md:p-12 rounded-2xl shadow-2xl border-white/5">
              <h2 className="text-white mb-6">Ready to Bring Your Vision to Life?</h2>
              <p className="text-dark-200 text-lg mb-8">
                Contact us today to discuss your project and see how FOKAL MULTIMEDIA can help you create stunning visual content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="btn btn-accent px-8">
                  Contact Us
                </Link>
                <Link to="/booking" className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm px-8">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="w-full h-full grid grid-cols-6 grid-rows-3">
              {[...Array(18)].map((_, index) => (
                <div key={index} className="border border-white/5"></div>
              ))}
            </div>
          </div>
        </section>
    </PageTransition>
  );
};

export default HomePage;