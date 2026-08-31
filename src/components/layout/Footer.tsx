import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { logoUrl } from './Header';

export default function Footer() {
  return <footer className="fokal-footer">
    <div className="footer-grid">
      <div><img className="footer-logo" src={logoUrl} alt="Fokal"/><p>A Papua New Guinea based media production, marketing and events company delivering creative solutions that connect brands with people and make an impact that lasts.</p><div className="socials"><Facebook/><Instagram/><Youtube/><Linkedin/></div></div>
      <div><h4>QUICK LINKS</h4><Link to="/">Home</Link><Link to="/about">About Us</Link><Link to="/services">Services</Link><Link to="/gallery">Our Work</Link><Link to="/contact">Contact Us</Link></div>
      <div><h4>OUR SERVICES</h4><span>Video Production</span><span>Photography</span><span>Live Streaming</span><span>Events</span><span>Marketing</span><span>Staging & AV</span></div>
      <div><h4>CONTACT US</h4><span><Phone/> +675 7383 0011</span><span><Mail/> info@fokalltd.com</span><span><MapPin/> Port Moresby, NCD<br/>Papua New Guinea</span></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Fokal Solutions Limited. All Rights Reserved.</span><b>FOCAL POINT. <em>REAL IMPACT.</em></b></div>
  </footer>;
}
