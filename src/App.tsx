import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Toaster } from '@/components/ui/sonner';

// Pages
import Home from './pages/Home';
import GetHelp from './pages/GetHelp';
import Advocates from './pages/Advocates';
import Blog from './pages/Blog';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import Terms from './pages/Terms';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Disclaimer from './components/Disclaimer';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
    return localStorage.getItem('legal_disclaimer_accepted') === 'true';
  });

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (firebaseUser) {
        // Check if email is an authorized admin
        const adminEmails = ["1legalhelpkolkata@gmail.com", "mtripti85@gmail.com"];
        if (firebaseUser.email && adminEmails.includes(firebaseUser.email)) {
          setRole('admin');
          setLoading(false);
        } else {
          // Listen to user document for role changes
          unsubscribeDoc = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
            if (docSnap.exists()) {
              setRole(docSnap.data().role || 'client');
            } else {
              setRole('client');
            }
            setLoading(false);
          }, (error) => {
            console.error("Error listening to user role:", error);
            setRole('client');
            setLoading(false);
          });
        }
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  useEffect(() => {
    if (!disclaimerAccepted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [disclaimerAccepted]);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('legal_disclaimer_accepted', 'true');
    setDisclaimerAccepted(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans text-slate-900 bg-white">
        {!disclaimerAccepted && <Disclaimer onAccept={handleAcceptDisclaimer} />}
        
        <Navbar user={user} role={role} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/get-help" element={<GetHelp />} />
            <Route path="/advocates" element={<Advocates />} />
            <Route path="/blog" element={<Blog user={user} role={role} />} />
            <Route path="/registration" element={<Registration user={user} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Protected Admin Route */}
            <Route 
              path="/admin" 
              element={role === 'admin' ? <Admin /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}
