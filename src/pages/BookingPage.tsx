import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import SectionHeading from '../components/common/SectionHeading';
import BookingForm from '../components/common/BookingForm';
import OptimizedImage from '../components/common/OptimizedImage';
import { Calendar, Clock, CreditCard, CheckCircle, ChevronRight, HelpCircle } from 'lucide-react';
import { media, getPublicImageUrl } from '../lib/media';

const bookingSteps = [
  {
    title: 'Schedule Consultation',
    description: 'Book a consultation to discuss your project needs and vision.',
    icon: <Calendar size={36} className="text-accent-500" />
  },
  {
    title: 'Project Planning',
    description: "We'll develop a detailed project plan and proposal based on your requirements.",
    icon: <Clock size={36} className="text-accent-500" />
  },
  {
    title: 'Confirmation & Deposit',
    description: 'Approve the proposal and pay a deposit to secure your booking.',
    icon: <CreditCard size={36} className="text-accent-500" />
  },
  {
    title: 'Project Execution',
    description: 'We\'ll execute your project according to the agreed timeline and deliverables.',
    icon: <CheckCircle size={36} className="text-accent-500" />
  }
];

const BookingPage: React.FC = () => {
  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center py-40 mesh-gradient overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <OptimizedImage
            src={getPublicImageUrl(media.booking.hero)}
            alt="Book Now"
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
            Book Our <span className="text-gradient">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-dark-100 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed"
          >
            Ready to start your project? Fill out our booking form to schedule a consultation
            with our team and bring your vision to life.
          </motion.p>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-dark-950 to-transparent z-20"></div>
      </section>

      {/* Booking Process Section */}
      <section className="section bg-dark-950 relative">
        <div className="container-custom">
          <SectionHeading
            title="Our Booking Process"
            subtitle="Seamless steps from vision to delivery"
            centered
            gradientTitle
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {bookingSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass p-8 rounded-2xl shadow-xl border-white/5 hover:border-accent-500/30 transition-all duration-300 group text-center"
              >
                <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <div className="p-4 bg-accent-500/10 rounded-2xl border border-accent-500/20">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-white text-xl mb-4 font-bold">{step.title}</h3>
                <p className="text-dark-300 text-sm leading-relaxed">{step.description}</p>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 translate-y-[-50%] z-20 opacity-20 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={32} className="text-accent-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="section bg-dark-900 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass p-10 md:p-12 rounded-[32px] border-white/5 shadow-2xl"
            >
              <SectionHeading 
                title="Book Your Service" 
                subtitle="Fill out the form below and we'll be in touch."
                gradientTitle
              />
              <BookingForm />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="glass p-10 rounded-[32px] border-white/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <HelpCircle size={120} className="text-accent-500" />
                </div>
                
                <h3 className="text-white text-3xl font-black mb-8 tracking-tight">Booking <span className="text-gradient">FAQ</span></h3>
                
                <div className="space-y-8">
                  {[
                    {
                      q: "How soon can I book a service?",
                      a: "Availability varies by season. We recommend 4–6 weeks for most projects, and 2–3 months for large events."
                    },
                    {
                      q: "What is your cancellation policy?",
                      a: "Cancellations 14+ days before are eligible for a full deposit refund. Less than 14 days notice forfeits the deposit."
                    },
                    {
                      q: "Do you require a deposit?",
                      a: "Yes, a 50% deposit is required to secure your date. The balance is due upon project completion."
                    },
                    {
                      q: "What should I prepare for consultation?",
                      a: "Prepare project goals, timeline, budget, and any reference materials that help us understand your vision."
                    }
                  ].map((faq, i) => (
                    <div key={i} className="group">
                      <h4 className="text-white font-bold mb-2 flex items-center group-hover:text-accent-500 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mr-3"></span>
                        {faq.q}
                      </h4>
                      <p className="text-dark-300 text-sm leading-relaxed pl-4 border-l border-white/10 ml-0.5">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-accent-500 to-accent-600 p-1 rounded-2xl shadow-xl">
                <div className="bg-dark-900 rounded-[14px] p-8 flex items-center justify-between">
                  <div>
                    <p className="text-accent-500 font-bold uppercase tracking-widest text-xs mb-1">Need immediate help?</p>
                    <h4 className="text-white font-bold text-xl">Talk to a specialist</h4>
                  </div>
                  <a href="tel:+67570305609" className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center text-dark-900 shadow-lg hover:scale-110 transition-transform">
                    <CreditCard size={24} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      </section>
    </PageTransition>
  );
};

export default BookingPage;
