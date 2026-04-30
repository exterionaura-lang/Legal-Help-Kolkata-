import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { Scale, Menu, X, LogOut, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  user: User | null;
  role: string | null;
}

export default function Navbar({ user, role }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Get Legal Help', path: '/get-help' },
    { name: 'Advocates', path: '/advocates' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-slate-800 transition-colors">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Legal Help <span className="text-blue-600">Kolkata</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <UserCircle className="h-8 w-8 text-slate-600" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                      <p className="text-xs leading-none text-slate-500">{user.email}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {role === 'admin' && (
                    <DropdownMenuItem render={<Link to="/admin">Admin Panel</Link>} />
                  )}
                  <DropdownMenuItem render={<Link to="/registration">
                    {role === 'advocate' ? 'Advocate Profile' : 'Register as Advocate'}
                  </Link>} />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button render={<Link to="/login">Login</Link>} className="bg-slate-900 hover:bg-slate-800" />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-1"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-4 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 px-3">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 pb-4">
                  <UserCircle className="h-10 w-10 text-slate-400" />
                  <div>
                    <p className="text-sm font-bold">{user.email}</p>
                    <p className="text-xs text-blue-600 uppercase">{role}</p>
                  </div>
                </div>
                {role === 'admin' && (
                  <Button render={<Link to="/admin" onClick={() => setIsOpen(false)}>Admin Panel</Link>} variant="outline" className="w-full justify-start" />
                )}
                <Button onClick={handleLogout} variant="destructive" className="w-full">
                  Log out
                </Button>
              </div>
            ) : (
              <Button render={<Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>} className="w-full bg-slate-900" />
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
