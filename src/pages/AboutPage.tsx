import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import PageTransition from '../components/common/PageTransition';
import SectionHeading from '../components/common/SectionHeading';
import OptimizedImage from '../components/common/OptimizedImage';
import { Users, Award, Target, Zap, Instagram, Linkedin, Facebook, MessageCircle } from 'lucide-react';
import { media, getPublicImageUrl } from '../lib/media';

const iconMap: Record<string, React.ReactNode> = {
  Award: <Award size={32} className="text-accent-500" />,
  Zap: <Zap size={32} className="text-accent-500" />,
  Target: <Target size={32} className="text-accent-500" />,
  Users: <Users size={32} className="text-accent-500" />,
};

const HIDDEN_TEAM_MEMBERS = new Set(['OSWALD NICHOLAS']);
const TEAM_ORDER_OVERRIDES = new Map([
  ['PATRICK TURBARAT', 1],
  ['SHANNON AMBU', 2],
]);
const TEAM_ROLE_OVERRIDES = new Map([
  ['PATRICK TURBARAT', 'Managing Director'],
  ['SHANNON AMBU', 'Director / Operations Manager'],
]);
const TEAM_BIO_OVERRIDES = new Map([
  [
    'SHANNON AMBU',
    'Shannon serves as Director / Manager Operations, overseeing the company\'s day-to-day operations and ensuring seamless project execution. He focuses on efficiency, coordination, and quality delivery, supporting the team in maintaining high standards across all work. Through strong leadership and operational oversight, Shannon plays a key role in driving performance and ensuring the consistent delivery of impactful multimedia experiences.',
  ],
  [
    'PATRICK TURBARAT',
    'Patrick serves as Managing Director, providing overall leadership and strategic direction for the company. He drives business growth, strengthens client relationships, and ensures that every project aligns with the company\'s vision and standards. With a focus on innovation, performance, and long-term impact, Patrick leads the team in delivering high-quality multimedia experiences while positioning the company for sustained success.',
  ],
]);
const TEAM_SOCIAL_OVERRIDES = new Map([
  [
    'SHANNON AMBU',
    {
      facebook_url: 'https://www.facebook.com/ambu.shannon',
      linkedin_url: 'https://www.linkedin.com/in/shannon-ambu-98a083282/',
      instagram_url: 'https://www.instagram.com/specsman_ambu/',
    },
  ],
  [
    'PATRICK TURBARAT',
    {
      facebook_url: 'https://www.facebook.com/patrick.turbarat.9',
      linkedin_url: 'https://www.linkedin.com/in/patrick-turbarat-083399211/?isSelfProfile=false',
      instagram_url: 'https://www.instagram.com/mak3nii675/',
    },
  ],
]);

const normalizeTeamMemberName = (name: string) => name.trim().toUpperCase();

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  instagram_url?: string;
  linkedin_url?: string;
  facebook_url?: string;
  whatsapp_url?: string;
}

interface SiteValue {
  id: string;
  title: string;
  description: string;
  icon_name: string;
}

const getTeamSocialLinks = (member: TeamMember) => [
  {
    key: 'linkedin',
    href: member.linkedin_url,
    label: 'LinkedIn',
    icon: <Linkedin size={18} />,
    activeClassName: 'border-sky-300/35 bg-sky-500/18 text-sky-100 shadow-[0_18px_35px_-18px_rgba(56,189,248,0.8)] hover:border-sky-200/60 hover:bg-sky-400/28 hover:text-white',
    inactiveClassName: 'border-sky-300/20 bg-sky-500/10 text-sky-200/55 shadow-[0_16px_30px_-22px_rgba(56,189,248,0.65)]',
  },
  {
    key: 'facebook',
    href: member.facebook_url,
    label: 'Facebook',
    icon: <Facebook size={18} />,
    activeClassName: 'border-blue-300/35 bg-blue-500/18 text-blue-100 shadow-[0_18px_35px_-18px_rgba(59,130,246,0.78)] hover:border-blue-200/60 hover:bg-blue-400/28 hover:text-white',
    inactiveClassName: 'border-blue-300/20 bg-blue-500/10 text-blue-200/55 shadow-[0_16px_30px_-22px_rgba(59,130,246,0.6)]',
  },
  {
    key: 'instagram',
    href: member.instagram_url,
    label: 'Instagram',
    icon: <Instagram size={18} />,
    activeClassName: 'border-fuchsia-300/35 bg-fuchsia-500/16 text-fuchsia-100 shadow-[0_18px_35px_-18px_rgba(217,70,239,0.8)] hover:border-pink-200/60 hover:bg-pink-400/24 hover:text-white',
    inactiveClassName: 'border-fuchsia-300/20 bg-fuchsia-500/10 text-fuchsia-200/55 shadow-[0_16px_30px_-22px_rgba(217,70,239,0.62)]',
  },
  {
    key: 'whatsapp',
    href: member.whatsapp_url,
    label: 'WhatsApp',
    icon: <MessageCircle size={18} />,
    activeClassName: 'border-emerald-300/35 bg-emerald-500/18 text-emerald-100 shadow-[0_18px_35px_-18px_rgba(16,185,129,0.8)] hover:border-emerald-200/60 hover:bg-emerald-400/28 hover:text-white',
    inactiveClassName: 'border-emerald-300/20 bg-emerald-500/10 text-emerald-200/55 shadow-[0_16px_30px_-22px_rgba(16,185,129,0.62)]',
  },
];

const AboutPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [values, setValues] = useState<SiteValue[]>([]);
  const [loading, setLoading] = useState(true);
  const visibleTeam = team
    .filter((member) => !HIDDEN_TEAM_MEMBERS.has(normalizeTeamMemberName(member.name)))
    .map((member) => ({
      ...member,
      ...(TEAM_SOCIAL_OVERRIDES.get(normalizeTeamMemberName(member.name)) ?? {}),
      role: TEAM_ROLE_OVERRIDES.get(normalizeTeamMemberName(member.name)) ?? member.role,
      bio: TEAM_BIO_OVERRIDES.get(normalizeTeamMemberName(member.name)) ?? member.bio,
    }))
    .sort((left, right) => {
      const leftOrder = TEAM_ORDER_OVERRIDES.get(normalizeTeamMemberName(left.name)) ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = TEAM_ORDER_OVERRIDES.get(normalizeTeamMemberName(right.name)) ?? Number.MAX_SAFE_INTEGER;

      return leftOrder - rightOrder;
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamRes, valuesRes] = await Promise.all([
          supabase.from('team_members').select('*').order('display_order', { ascending: true }),
          supabase.from('site_values').select('*').order('display_order', { ascending: true })
        ]);

        if (teamRes.data) setTeam(teamRes.data);
        if (valuesRes.data) setValues(valuesRes.data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center py-40 mesh-gradient overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <OptimizedImage
            src={getPublicImageUrl(media.about.hero)}
            alt="About Us"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
            quality={85}
            lazy={false}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent z-10"></div>

        <div className="container-custom relative z-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white mb-6 text-6xl md:text-8xl font-black tracking-tighter"
          >
            About <span className="text-gradient">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-dark-100 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed"
          >
            We are a team of creative professionals dedicated to visual excellence
            and memorable storytelling through multimedia.
          </motion.p>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-dark-950 to-transparent z-20"></div>
      </section>

      {/* Story Section */}
      <section className="section bg-dark-950 relative">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <SectionHeading 
                title="Our Story" 
                subtitle="Passion in every frame"
                gradientTitle
              />
              <div className="space-y-6 text-dark-300 text-lg leading-relaxed">
                <p>
                  Fokal Solutions Limited, is a 100% Papua New Guinean-owned company that delivers integrated creative solutions across media production, marketing, research, and live events.
                </p>
                <p>
                  We blend innovation, storytelling, and strategy to help brands, communities, and organisations connect, engage, and grow. From compelling photo and video production to full-scale marketing campaigns, we are committed to excellence.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="h-1 w-12 bg-accent-500 rounded-full"></div>
                  <span className="text-white font-display font-bold uppercase tracking-widest text-sm">Est. 2024</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-accent-500/10 rounded-2xl blur-2xl group-hover:bg-accent-500/20 transition-all duration-500"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 aspect-[4/3]">
                <OptimizedImage
                  src={getPublicImageUrl(media.about.story)}
                  alt="Our studio" 
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                  width={800}
                  height={600}
                  quality={90}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 glass p-6 rounded-xl border border-white/10 shadow-xl hidden md:block">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
                    <Zap size={20} className="text-dark-900" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Quality Driven</p>
                    <p className="text-dark-400 text-xs">Unmatched standards</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-dark-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/5 rounded-full blur-[100px]"></div>
        <div className="container-custom relative z-10">
          <SectionHeading
            title="Our Values"
            subtitle="Core principles guiding our approach"
            centered
            gradientTitle
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl p-8 shadow-xl border-white/5 hover:border-accent-500/30 transition-all duration-300 group"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {iconMap[value.icon_name] || <Award size={32} className="text-accent-500" />}
                </div>
                <h3 className="text-white mb-4 text-xl font-bold">{value.title}</h3>
                <p className="text-dark-300 leading-relaxed text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section bg-dark-950 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-900 via-dark-950/80 to-transparent"></div>
        <div className="container-custom relative z-10">
          <SectionHeading
            title="Meet Our Team"
            subtitle="The creative professionals behind our vision"
            centered
            gradientTitle
          />

          <div className="flex flex-wrap justify-center gap-16 max-w-6xl mx-auto">
            {visibleTeam.map((member, index) => {
              const socialLinks = getTeamSocialLinks(member);

              return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: -48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="group flex w-full max-w-sm flex-col"
              >
                <div className="relative overflow-hidden rounded-2xl mb-8 aspect-[3/4] w-full shadow-2xl">
                  <OptimizedImage
                    src={member.image_url}
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    width={500}
                    height={667}
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="text-center px-4">
                  <h3 className="text-white text-3xl font-bold mb-2 group-hover:text-accent-500 transition-colors duration-300">{member.name}</h3>
                  <p className="text-accent-500 font-semibold tracking-widest uppercase text-xs mb-4">{member.role}</p>
                  <div className="relative mx-auto overflow-hidden text-center transition-[max-height] duration-700 ease-out max-h-[4.75rem] group-hover:max-h-[18rem]">
                    <p className="text-dark-300 text-sm leading-relaxed">{member.bio}</p>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-dark-950 via-dark-950/90 to-transparent opacity-100 transition-opacity duration-500 group-hover:opacity-0"></div>
                  </div>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {socialLinks.map((link) =>
                      link.href ? (
                        <a
                          key={link.key}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${member.name} on ${link.label}`}
                          className={`relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border backdrop-blur-xl ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${link.activeClassName}`}
                        >
                          <span className="pointer-events-none absolute inset-[1px] rounded-full bg-gradient-to-br from-white/22 via-white/10 to-transparent"></span>
                          <span className="pointer-events-none absolute inset-x-2 top-1 h-3 rounded-full bg-white/20 blur-sm"></span>
                          <span className="relative z-10">{link.icon}</span>
                        </a>
                      ) : (
                        <span
                          key={link.key}
                          aria-label={`${link.label} link coming soon`}
                          className={`relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border backdrop-blur-xl ring-1 ring-white/5 opacity-90 ${link.inactiveClassName}`}
                        >
                          <span className="pointer-events-none absolute inset-[1px] rounded-full bg-gradient-to-br from-white/16 via-white/8 to-transparent"></span>
                          <span className="pointer-events-none absolute inset-x-2 top-1 h-3 rounded-full bg-white/12 blur-sm"></span>
                          <span className="relative z-10">{link.icon}</span>
                        </span>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section mesh-gradient relative py-24">
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto glass p-12 rounded-3xl border-white/10 shadow-3xl">
            <h2 className="text-white mb-8 text-4xl md:text-5xl font-black">Ready to Start a <span className="text-gradient">Project?</span></h2>
            <p className="text-dark-200 text-xl mb-12 font-light">
              We're always looking for new challenges and exciting projects. Get in touch to discuss how we can help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="/contact" className="btn btn-accent px-12 py-4 text-lg font-bold shadow-xl hover:shadow-accent-500/20 transform hover:-translate-y-1 transition-all">
                Contact Us
              </a>
              <a href="/gallery" className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20 px-12 py-4 text-lg backdrop-blur-sm transform hover:-translate-y-1 transition-all">
                View Gallery
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default AboutPage;
