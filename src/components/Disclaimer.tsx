import { motion } from 'framer-motion';
import { Scale, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DisclaimerProps {
  onAccept: () => void;
}

export default function Disclaimer({ onAccept }: DisclaimerProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className="bg-white max-w-2xl w-full rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20"
      >
        {/* Visual Header with Vibrant Image & Gradient */}
        <div className="relative h-72 flex items-center justify-center text-white text-center overflow-hidden">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-125"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1200")',
              filter: 'brightness(0.5) contrast(1.1)'
            }}
          />
          {/* Colorful Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-white z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 z-[1]" />
          
          <div className="relative z-10 space-y-4 px-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
              className="bg-gradient-to-br from-amber-400 to-amber-600 p-5 rounded-[2rem] inline-block shadow-2xl shadow-amber-500/20 border-2 border-white/30 mb-2"
            >
              <Scale className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter drop-shadow-2xl">
              Legal Help <span className="text-amber-400">Kolkata</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-amber-400/50" />
              <p className="text-blue-50 text-sm font-black tracking-[0.3em] uppercase">Smart Legal Access</p>
              <div className="h-px w-8 bg-amber-400/50" />
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 -mt-10 relative z-20 bg-white rounded-t-[3rem] space-y-10">
          <div className="space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 leading-none">Welcome to the Platform</h2>
                  <p className="text-slate-400 text-sm mt-1 font-medium">Empowering West Bengal with Legal Awareness</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-[2rem] border border-blue-100/50 space-y-3 shadow-sm"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Scale className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="font-black text-blue-900 text-xs uppercase tracking-widest">Our Mission</p>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    Simplifying legal access through modern technology and professional guidance.
                  </p>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-[2rem] border border-amber-100/50 space-y-3 shadow-sm"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="font-black text-amber-900 text-xs uppercase tracking-widest">Free Awareness</p>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    Open platform for legal knowledge and professional Q&A for everyone.
                  </p>
                </motion.div>
              </div>
            </section>

            <section className="space-y-5 bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                <Scale className="w-40 h-40 text-white" />
              </div>
              <div className="flex items-center gap-3 text-amber-400 font-black text-lg relative z-10 uppercase tracking-widest">
                <AlertTriangle className="w-5 h-5" />
                <h2>Legal Disclaimer</h2>
              </div>
              <ul className="space-y-4 text-sm text-slate-300 relative z-10 font-medium">
                <li className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <span>This is <strong className="text-white">NOT</strong> a law firm and does not provide legal advice.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <span>No solicitation of clients is made through this platform.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <span>Information is for general guidance and awareness purposes only.</span>
                </li>
              </ul>
              <div className="pt-5 border-t border-slate-800 relative z-10">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                  Compliant with Bar Council of India Rules
                </p>
              </div>
            </section>
          </div>

          <div className="pt-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={onAccept}
                className="w-full py-10 text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white transition-all rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  I AGREE & CONTINUE
                  <motion.span
                    animate={{ x: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              </Button>
            </motion.div>
            <p className="text-center text-[10px] text-slate-400 mt-8 font-bold uppercase tracking-widest">
              Secure & Professional Legal Intermediary
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
