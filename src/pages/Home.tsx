import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scale, ShieldCheck, Users, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] py-20 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed transition-transform duration-[30s] scale-110 animate-pulse-slow"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=2000")',
            filter: 'brightness(0.35) contrast(1.1)'
          }}
        />
        {/* Colorful Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-white z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 z-[1]" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
              className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-xl inline-block shadow-2xl shadow-amber-500/30 border-2 border-white/20 mb-6"
            >
              <Scale className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
              Legal Help <span className="text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">Kolkata</span>
            </h1>
            
            <p className="text-lg md:text-3xl text-blue-50 mb-8 font-medium max-w-3xl mx-auto leading-relaxed opacity-90">
              Smart Legal Access for Everyone. <span className="text-amber-200">Simplifying</span> the process of finding the right legal help in West Bengal.
            </p>
            
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <Button 
                    render={<Link to="/get-help">Get Legal Help Now</Link>} 
                    size="lg" 
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg md:text-xl px-8 py-6 md:px-10 md:py-8 rounded-2xl shadow-2xl shadow-blue-500/40 border-b-4 border-blue-800" 
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <Button 
                    render={<Link to="/blog">Free Legal Help Blog</Link>} 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto bg-white/10 backdrop-blur-xl text-white border-white/30 hover:bg-white/20 text-lg md:text-xl px-8 py-6 md:px-10 md:py-8 rounded-2xl" 
                  />
                </motion.div>
              </div>
          </motion.div>
        </div>
      </section>

      {/* Motto Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Our Motto
              </div>
              <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                Smart Legal Access for Everyone
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  We simplify the process of finding the right legal help in Kolkata and across West Bengal.
                </p>
                <p>
                  A <span className="font-bold text-slate-900">Free Legal Awareness Platform</span>, designed to make legal support accessible to all.
                </p>
                <p>
                  Through our Free Legal Help Blog, we empower users with legal knowledge, awareness, and guidance to better understand their legal issues.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1000" 
                alt="Legal Scales" 
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Menu Sections with Parallax-style backgrounds */}
      <div className="space-y-0">
        {/* Get Legal Help Section */}
        <section className="relative h-[60vh] flex items-center overflow-hidden group">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-fixed transition-transform duration-700 group-hover:scale-105"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000")',
              filter: 'brightness(0.5)'
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-xl text-white space-y-6"
            >
              <h2 className="text-4xl font-bold">Get Legal Help Page</h2>
              <p className="text-lg text-slate-200">
                Submit your legal query securely. Our platform connects you with the right legal expertise while maintaining strict privacy.
              </p>
              <Button render={<Link to="/get-help" className="flex items-center gap-2">Fill the Form <ArrowRight className="w-4 h-4" /></Link>} size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl" />
            </motion.div>
          </div>
        </section>

        {/* Are You a Practicing Advocate Section */}
        <section className="relative h-[60vh] flex items-center justify-end overflow-hidden group">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-fixed transition-transform duration-700 group-hover:scale-105"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1521791136064-7986c2959213?auto=format&fit=crop&q=80&w=2000")',
              filter: 'brightness(0.5)'
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-xl text-white space-y-6 ml-auto text-right"
            >
              <h2 className="text-4xl font-bold">Are You a Practicing Advocate?</h2>
              <p className="text-lg text-slate-200">
                Join our platform. Registration and listing are totally free for all interested Advocates.
              </p>
              <Button render={<Link to="/registration" className="flex items-center gap-2 ml-auto">Register as Advocate <ArrowRight className="w-4 h-4" /></Link>} size="lg" variant="outline" className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 rounded-xl" />
            </motion.div>
          </div>
        </section>

        {/* Advocates Page Section */}
        <section className="relative h-[60vh] flex items-center overflow-hidden group">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-fixed transition-transform duration-700 group-hover:scale-105"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1423592707957-3b212afa6733?auto=format&fit=crop&q=80&w=2000")',
              filter: 'brightness(0.5)'
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-xl text-white space-y-6"
            >
              <h2 className="text-4xl font-bold">Advocates Directory</h2>
              <p className="text-lg text-slate-200">
                View our registered advocates, their experience, and practicing courts. Professional profiles maintained with BCI compliance.
              </p>
              <Button render={<Link to="/advocates" className="flex items-center gap-2">View Advocates <ArrowRight className="w-4 h-4" /></Link>} size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-xl" />
            </motion.div>
          </div>
        </section>
      </div>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Our Platform?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We provide a secure and professional bridge between the legal community and the public.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
                title: "Privacy First",
                desc: "Your contact details are never disclosed openly. Only authorized admins can access your information."
              },
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "Verified Advocates",
                desc: "We list advocates with their years of experience and practicing courts for informed decisions."
              },
              {
                icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
                title: "Free Awareness",
                desc: "Our blog is an open platform for Q&A, empowering you with legal knowledge and awareness."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
