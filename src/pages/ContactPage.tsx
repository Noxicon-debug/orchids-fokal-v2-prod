import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import SectionHeading from '../components/common/SectionHeading';
import ContactForm from '../components/common/ContactForm';
import OptimizedImage from '../components/common/OptimizedImage';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import { media, getPublicImageUrl } from '../lib/media';

const ContactPage: React.FC = () => {
  const contactInfo = [
    {
      icon: <MapPin size={28} className="text-accent-500" />,
      title: 'Visit Us',
      details: [
        'Garden Hills, Port Moresby',
        'National Capital District, PNG'
      ]
    },
    {
      icon: <Phone size={28} className="text-accent-500" />,
      title: 'Call Us',
      details: [
        '(+675) 7383 0011 / 7813 3694'
      ]
    },
    {
      icon: <Mail size={28} className="text-accent-500" />,
      title: 'Email Us',
      details: [
        'info@fokalltd.com'
      ]
    },
    {
      icon: <Clock size={28} className="text-accent-500" />,
      title: 'Working Hours',
      details: [
        'Mon - Fri: 9AM - 6PM',
        'Sat: 9AM - 1PM'
      ]
    }
  ];

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center py-40 mesh-gradient overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <OptimizedImage
            src={getPublicImageUrl(media.contact.hero)}
            alt="Contact Us"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
            quality={85}
            lazy={false}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent z-10"></div>

        <div className="container-custom relative z-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white mb-6 text-6xl md:text-8xl font-black tracking-tighter"
          >
            Get in <span className="text-gradient">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-dark-100 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed"
          >
            Have a project in mind or want to learn more about our services?
            We're here to help you bring your vision to life.
          </motion.p>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-dark-950 to-transparent z-20"></div>
      </section>

      {/* Contact Info Section */}
      <section className="section bg-dark-950 relative">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass p-8 rounded-2xl shadow-xl border-white/5 hover:border-accent-500/30 transition-all duration-300 group"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-white mb-4 text-xl font-bold">{item.title}</h3>
                <div className="text-dark-300 space-y-1">
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-sm leading-relaxed">{detail}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass p-10 md:p-12 rounded-[32px] border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <SectionHeading 
                  title="Send us a Message" 
                  subtitle="Fill out the form and our team will get back to you within 24 hours."
                  gradientTitle
                />
                <ContactForm />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-full space-y-8"
            >
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-white/5 aspect-square lg:aspect-auto lg:h-[calc(100%-80px)] group">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d983.9028368528367!2d147.18650279248251!3d-9.455436511836579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2spg!4v1753383836102!5m2!1sen!2spg" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="FOKAL MULTIMEDIA Location"
                  className="grayscale-[0.5] contrast-[1.2] invert-[0.9] hue-rotate-[180deg] group-hover:grayscale-0 group-hover:invert-0 group-hover:hue-rotate-0 transition-all duration-1000"
                ></iframe>
              </div>
              
              <div className="glass p-8 rounded-2xl border-white/5 flex items-center justify-between group cursor-pointer hover:border-accent-500/30 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent-500/20 rounded-full flex items-center justify-center text-accent-500">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Live Chat</h4>
                    <p className="text-dark-400 text-sm">Speak with our team now</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-accent-500 group-hover:text-dark-900 transition-all">
                  <Send size={18} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-dark-900 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="container-custom relative z-10">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about our services and process."
            centered
            gradientTitle
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                q: "What areas do you serve?",
                a: "We primarily serve Papua New Guinea as a whole, but we also work with international clients and can travel for projects as needed."
              },
              {
                q: "How far in advance should I book?",
                a: "We recommend booking at least 4-6 weeks in advance for most services, especially during peak seasons. For large events, 2-3 months is preferable."
              },
              {
                q: "What is your pricing structure?",
                a: "Our pricing varies based on the specific service, project scope, and requirements. We provide customized quotes after an initial consultation."
              },
              {
                q: "What is your turnaround time?",
                a: "Turnaround times vary by project type. For standard photography, 1-2 weeks. For video projects, 2-4 weeks depending on complexity."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass p-8 rounded-2xl border-white/5 hover:border-accent-500/20 transition-all"
              >
                <h3 className="text-white text-xl mb-4 font-bold">{faq.q}</h3>
                <p className="text-dark-300 leading-relaxed text-sm">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default ContactPage;