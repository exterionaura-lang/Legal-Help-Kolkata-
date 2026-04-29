import { Link } from 'react-router-dom';
import { Scale, Mail, Clock, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <Scale className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white tracking-tight">
                Legal Help Kolkata
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Simplifying legal access across West Bengal. Empowering individuals with knowledge and professional guidance.
            </p>
            <div className="flex gap-4">
              <a href="https://wa.me/918697457657" className="p-2 bg-slate-900 rounded-full hover:bg-slate-800 transition-colors">
                <MessageSquare className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/get-help" className="hover:text-white transition-colors">Get Legal Help</Link></li>
              <li><Link to="/advocates" className="hover:text-white transition-colors">Find Advocates</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Legal Blog</Link></li>
              <li><Link to="/registration" className="hover:text-white transition-colors">Advocate Registration</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>1legalhelpkolkata@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4" />
                <span>9:00 AM - 7:00 PM (Mon-Sat)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-900 text-center text-xs">
          <p>© {new Date().getFullYear()} Legal Help Kolkata. All rights reserved. <Link to="/terms" className="text-blue-400 hover:underline ml-2">Terms & Conditions</Link></p>
        </div>
      </div>
    </footer>
  );
}
