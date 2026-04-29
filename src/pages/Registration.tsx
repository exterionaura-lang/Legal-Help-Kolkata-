import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Briefcase, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RegistrationProps {
  user: User | null;
}

export default function Registration({ user }: RegistrationProps) {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: user?.email || '',
    experience: '',
    court: '',
    specialization: ''
  });

  useEffect(() => {
    async function checkProfile() {
      if (user) {
        // First try to get from users collection for the display name if auth is missing it
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.exists() ? userDocSnap.data() : null;

        const docRef = doc(db, 'advocates', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const advocateData = docSnap.data();
          setExistingProfile(advocateData);
          setFormData(prev => ({ 
            ...prev, 
            ...advocateData,
            name: advocateData.name || user.displayName || userData?.displayName || ''
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            name: user.displayName || userData?.displayName || '',
            email: user.email || ''
          }));
        }
      }
      setChecking(false);
    }
    checkProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting advocate registration...', formData);
    
    if (!user) {
      toast.error('Please login first.');
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error('Phone number must be 10 digits.');
      return;
    }

    setLoading(true);
    try {
      const advocateData = {
        ...formData,
        uid: user.uid,
        experience: Number(formData.experience),
        status: existingProfile?.status || 'pending',
        createdAt: existingProfile?.createdAt || serverTimestamp()
      };

      console.log('Saving advocate data to Firestore...');
      await setDoc(doc(db, 'advocates', user.uid), advocateData);
      
      console.log('Updating user role to advocate...');
      // Also update user role to advocate if not already
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: formData.name,
        role: 'advocate',
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast.success('Registration submitted successfully! Waiting for admin approval.');
      setExistingProfile(advocateData);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8 rounded-2xl shadow-xl border-none">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-slate-600 mb-8">You must be logged in to register as an advocate.</p>
          <Button render={<Link to="/login">Go to Login</Link>} className="w-full bg-slate-900 py-6 rounded-xl" />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header with Background */}
      <div className="relative py-24 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://picsum.photos/seed/advocate-registration/1920/1080?blur=4")',
            filter: 'brightness(0.3)'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-5xl font-bold text-white tracking-tight">Advocate Registration</h1>
          <p className="text-slate-200 text-xl max-w-2xl mx-auto">
            Join our network of legal professionals and help empower the community.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 w-full">
        {existingProfile && (
          <div className={`mb-8 p-6 rounded-2xl border flex items-center gap-4 ${
            existingProfile.status === 'approved' ? 'bg-green-50 border-green-100 text-green-800' :
            existingProfile.status === 'rejected' ? 'bg-red-50 border-red-100 text-red-800' :
            'bg-amber-50 border-amber-100 text-amber-800'
          }`}>
            {existingProfile.status === 'approved' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
            <div>
              <p className="font-bold uppercase text-xs tracking-widest mb-1">Application Status</p>
              <p className="text-lg">
                Your registration is <strong>{existingProfile.status.toUpperCase()}</strong>.
                {existingProfile.status === 'pending' && " We'll notify you once approved."}
                {existingProfile.status === 'approved' && " You can now answer questions in the blog."}
              </p>
            </div>
          </div>
        )}

        <Card className="shadow-xl border-none rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-900 text-white p-8">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-6 h-6 text-blue-400" />
              <CardTitle>Professional Details</CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              Provide accurate information as per your Bar Council registration. You can update your details at any time.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="rounded-xl border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    required 
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="rounded-xl border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    disabled 
                    value={formData.email}
                    className="rounded-xl border-slate-200 bg-slate-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input 
                    id="experience" 
                    type="number" 
                    required 
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="rounded-xl border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="court">Practicing Court(s)</Label>
                <Input 
                  id="court" 
                  required 
                  placeholder="e.g. Calcutta High Court, Alipore Court"
                  value={formData.court}
                  onChange={(e) => setFormData({...formData, court: e.target.value})}
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization (Comma separated)</Label>
                <Textarea 
                  id="specialization" 
                  required 
                  placeholder="e.g. Civil, Criminal, Family Law"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  className="rounded-xl border-slate-200"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-7 text-lg font-bold bg-slate-900 hover:bg-slate-800 rounded-xl transition-all"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  existingProfile ? 'Update Registration' : 'Submit Registration'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
