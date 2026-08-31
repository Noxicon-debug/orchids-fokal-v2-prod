import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import PageTransition from '../components/common/PageTransition';
import SectionHeading from '../components/common/SectionHeading';
import OptimizedImage from '../components/common/OptimizedImage';
import { Camera, Video, Calendar, PenTool, LayoutGrid, Check, ArrowRight } from 'lucide-react';
import { media, getPublicImageUrl } from '../lib/media';

const iconMap: Record<string, React.ReactNode> = {
  Video: <Video size={40} className="text-accent-500" />,
  Camera: <Camera size={40} className="text-accent-500" />,
  Calendar: <Calendar size={40} className="text-accent-500" />,
  PenTool: <PenTool size={40} className="text-accent-500" />,
  LayoutGrid: <LayoutGrid size={40} className="text-accent-500" />,
};

interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_name: string;
  image_url: string;
  features: string[];
}

interface ServiceFeature {
  feature: string;
}

interface RawService {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_name: string;
  image_url: string;
  service_features: ServiceFeature[];
}

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*, service_features(feature)')
          .order('display_order', { ascending: true });

        if (servicesError) throw servicesError;

        if (servicesData) {
          const formattedServices = (servicesData as unknown as RawService[]).map((s) => ({
            ...s,
            features: s.service_features.map((f) => f.feature)
          }));
          setServices(formattedServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center py-40 mesh-gradient overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <OptimizedImage
            src={getPublicImageUrl(media.services.hero)}
            alt="Services"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
            quality={85}
            lazy={false}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/20 via-dark-950/80 to-dark-950 z-10"></div>

        <div className="container-custom relative z-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white mb-6 text-6xl md:text-8xl font-black tracking-tighter"
          >
            Our <span className="text-gradient">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-dark-100 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed"
          >
            Comprehensive multimedia solutions to bring your vision to life with precision and creativity.
          </motion.p>
        </div>
      </section>

      {/* Services Details Section */}
      <section className="section bg-dark-950 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <SectionHeading
            title="Professional Solutions"
            subtitle="Tailored multimedia services for your unique needs"
            centered
            gradientTitle
          />

          <div className="space-y-40">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                id={service.slug}
                className={`scroll-mt-32 transition-all duration-1000`}
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center ${index % 2 !== 0 ? 'lg:grid-flow-dense' : ''}`}>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                  >
                    <div className="flex items-center mb-8">
                      <div className="p-4 bg-accent-500/10 rounded-2xl border border-accent-500/20 mr-5">
                        {iconMap[service.icon_name]}
                      </div>
                      <h2 className="text-white text-4xl md:text-5xl font-black tracking-tight">{service.title}</h2>
                    </div>
                    <p className="text-dark-200 text-xl mb-10 leading-relaxed font-light">
                      {service.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 mb-12">
                      {service.features.map((feature, fIndex) => (
                        <motion.div 
                          key={feature} 
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + (fIndex * 0.1) }}
                          className="flex items-center space-x-3 group"
                        >
                          <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center group-hover:bg-accent-500 transition-colors duration-300">
                            <Check size={14} className="text-accent-500 group-hover:text-dark-900 transition-colors duration-300" />
                          </div>
                          <span className="text-dark-300 group-hover:text-white transition-colors duration-300">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="pt-4">
                      <a href="/booking" className="inline-flex items-center text-accent-500 font-bold hover:text-accent-400 group transition-all">
                        Book this service 
                        <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: index % 2 === 0 ? 2 : -2 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                  >
                    <div className="absolute -inset-4 bg-accent-500/10 rounded-3xl blur-2xl"></div>
                    <div className="relative rounded-3xl overflow-hidden shadow-3xl border border-white/10 aspect-[4/3] group">
                      <OptimizedImage
                        src={service.image_url}
                        alt={service.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        width={800}
                        height={600}
                        quality={90}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      </section>

      {/* CTA Section */}
      <section className="section mesh-gradient relative py-24">
        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto glass rounded-[40px] p-12 md:p-20 border-white/10 shadow-3xl text-center overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-white mb-8 text-4xl md:text-6xl font-black">Ready for <span className="text-gradient">Impact?</span></h2>
              <p className="text-dark-200 text-xl md:text-2xl mb-12 font-light max-w-2xl mx-auto">
                Whether it's a small project or a large-scale production, we're here to make it exceptional.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a href="/booking" className="btn btn-accent px-12 py-5 text-xl font-bold shadow-2xl hover:shadow-accent-500/30 transform hover:-translate-y-1 transition-all">
                  Get a Quote
                </a>
                <a href="/contact" className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20 px-12 py-5 text-xl backdrop-blur-md transform hover:-translate-y-1 transition-all">
                  Contact Support
                </a>
              </div>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default ServicesPage;