import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scale, LogIn, Mail, UserPlus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSyncUser = async (user: any, isNewUser: boolean = false) => {
    // Check if user exists in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // Sync user profile and role
    const adminEmails = ['1legalhelpkolkata@gmail.com', 'mtripti85@gmail.com'];
    const isAdminEmail = adminEmails.includes(user.email || '');
    
    const existingData = userSnap.exists() ? userSnap.data() : null;
    const userRole = isAdminEmail ? 'admin' : (existingData?.role || 'client');
    
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || name || existingData?.displayName,
      role: userRole,
      lastLogin: serverTimestamp(),
      createdAt: existingData?.createdAt || serverTimestamp(),
    }, { merge: true });

    toast.success('Logged in successfully!');
    navigate('/');
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handleSyncUser(result.user);
    } catch (error: any) {
      console.error('Login error:', error);
      const errorCode = error.code;
      
      switch (errorCode) {
        case 'auth/unauthorized-domain':
          toast.error('This domain is not authorized. Please check Firebase Console.');
          break;
        case 'auth/popup-blocked':
          toast.error('Login popup was blocked. Please allow popups.');
          break;
        case 'auth/popup-closed-by-user':
          toast.info('Login cancelled by user.');
          break;
        case 'auth/user-disabled':
          toast.error('This account has been disabled. Please contact support.');
          break;
        case 'auth/account-exists-with-different-credential':
          toast.error('Account exists with different credentials. Please use your original sign-in method.');
          break;
        default:
          toast.error(error.message || 'Failed to login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Please check your inbox.');
      setIsResetMode(false);
    } catch (error: any) {
      console.error('Reset error:', error);
      toast.error(error.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    try {
      if (isSignUp) {
        if (!name) {
          toast.error('Please enter your name');
          setLoading(false);
          return;
        }
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        await handleSyncUser(result.user, true);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await handleSyncUser(result.user);
      }
    } catch (error: any) {
      console.error('Email auth error:', error);
      const errorCode = error.code;
      
      switch (errorCode) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          toast.error('Invalid email or password. Please check your credentials.');
          break;
        case 'auth/email-already-in-use':
          toast.error('This email is already registered. Please sign in with your password below.');
          setIsSignUp(false);
          setPassword(''); // Clear password for security and fresh attempt
          // Ensure prompt is clear
          setTimeout(() => {
            const passwordInput = document.getElementById('password');
            if (passwordInput) passwordInput.focus();
          }, 100);
          break;
        case 'auth/weak-password':
          toast.error('Password is too weak. Please use at least 6 characters.');
          break;
        case 'auth/invalid-email':
          toast.error('Please enter a valid email address.');
          break;
        case 'auth/user-disabled':
          toast.error('This account has been disabled. Please contact support.');
          break;
        case 'auth/too-many-requests':
          toast.error('Too many failed attempts. Please try again later or reset your password.');
          break;
        case 'auth/operation-not-allowed':
          toast.error('Email/Password authentication is not enabled. Please contact support.');
          break;
        default:
          toast.error(error.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 pt-20">
      <Card className="max-w-md w-full shadow-2xl border-none rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-900 text-white text-center py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#fff,transparent_70%)]" />
          <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/20 relative z-10 shadow-lg">
            {isResetMode ? <Mail className="w-10 h-10 text-white" /> : <Scale className="w-10 h-10 text-white" />}
          </div>
          <CardTitle className="text-3xl font-black tracking-tight relative z-10">
            {isResetMode ? 'Reset Password' : (isSignUp ? 'Create Account' : 'Welcome Back')}
          </CardTitle>
          <CardDescription className="text-slate-400 mt-2 relative z-10 font-medium">
            {isResetMode ? 'Enter your email to receive a reset link' : (isSignUp ? 'Join Legal Help Kolkata today' : 'Login to your legal dashboard')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            {isResetMode ? (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div className="space-y-1.5">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input 
                    id="reset-email" 
                    type="email" 
                    placeholder="advocate@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border-slate-200 h-12"
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full h-12 bg-slate-900 rounded-xl font-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : 'Send Reset Link'}
                </Button>
                <button 
                  type="button"
                  onClick={() => setIsResetMode(false)}
                  className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </button>
              </form>
            ) : (
              <>
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-xl border-slate-200 h-12"
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="advocate@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl border-slate-200 h-12"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {!isSignUp && (
                        <button 
                          type="button" 
                          onClick={() => setIsResetMode(true)}
                          className="text-xs text-blue-600 font-bold hover:underline"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl border-slate-200 h-12"
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full h-12 bg-slate-900 rounded-xl font-bold shadow-lg shadow-slate-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                        <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                      </div>
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or continue with</span>
                  </div>
                </div>

                <Button 
                  onClick={handleGoogleLogin} 
                  disabled={loading}
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  <span className="font-bold text-slate-700">Google</span>
                </Button>
                
                <p className="text-center text-sm text-slate-500 font-medium">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 p-6 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400 w-full uppercase tracking-widest font-black">
            Secured by Firebase Authentication
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
