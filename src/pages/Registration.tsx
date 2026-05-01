import React, { useState, useEffect } from 'react';
import { User, deleteUser, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Briefcase, CheckCircle2, Clock, AlertCircle, Trash2, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface RegistrationProps {
  user: User | null;
}

export default function Registration({ user }: RegistrationProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [password, setPassword] = useState('');
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

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      // 1. Delete Firestore Data
      await deleteDoc(doc(db, 'advocates', user.uid));
      await deleteDoc(doc(db, 'users', user.uid));
      
      // 2. Delete Auth User
      try {
        await deleteUser(user);
        toast.success('Account deleted successfully.');
        navigate('/');
      } catch (authError: any) {
        if (authError.code === 'auth/requires-recent-login') {
          // If the user uses Google, try to re-auth with popup skipping password
          const provider = user.providerData[0]?.providerId;
          if (provider === 'google.com') {
            const googleProvider = new GoogleAuthProvider();
            await signInWithPopup(auth, googleProvider);
            await deleteUser(user);
            toast.success('Account deleted successfully.');
            navigate('/');
          } else if (password) {
            // Try with password
            const credential = EmailAuthProvider.credential(user.email!, password);
            await reauthenticateWithCredential(user, credential);
            await deleteUser(user);
            toast.success('Account deleted successfully.');
            navigate('/');
          } else {
            toast.error('This is a sensitive operation and requires recent login. Please enter your password or sign in again.');
            setDeleting(false);
            return;
          }
        } else {
          throw authError;
        }
      }
    } catch (error: any) {
      console.error('Deletion error:', error);
      toast.error(error.message || 'Failed to delete account.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
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
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="advocate@example.com"
                    className="rounded-xl border-slate-200"
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
          <CardFooter className="bg-red-50 border-t border-red-200 p-8 flex flex-col items-start gap-4">
            <div className="flex items-center gap-2 text-red-800">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold">Dangerous Action</h3>
            </div>
            <p className="text-sm text-red-600">
              Deleting your account is permanent and cannot be undone. All your profile information, advocate status, and associated data will be removed from our systems to comply with privacy standards.
            </p>
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="rounded-xl flex items-center gap-2 font-bold px-6 py-6 shadow-lg shadow-red-200">
                  <Trash2 className="w-4 h-4" />
                  Delete My Account & Data
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-slate-900">Are you absolutely sure?</DialogTitle>
                  <DialogDescription className="text-slate-600 pt-2">
                    This action is permanent. It will delete your legal profile, your user account, and all associated personal data.
                  </DialogDescription>
                </DialogHeader>
                
                {user?.providerData[0]?.providerId === 'password' && (
                  <div className="py-4 space-y-2">
                    <Label htmlFor="confirm-password">Enter password to confirm</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your account password"
                      className="rounded-xl"
                    />
                  </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0 mt-4">
                  <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="rounded-xl">Cancel</Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount} 
                    disabled={deleting}
                    className="rounded-xl font-bold px-6"
                  >
                    {deleting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : 'Yes, Delete Everything'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
