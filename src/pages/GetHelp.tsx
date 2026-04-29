import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ShieldCheck, Send } from 'lucide-react';

export default function GetHelp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    category: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a legal category.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'queries'), {
        ...formData,
        status: 'new',
        createdAt: serverTimestamp()
      });
      
      toast.success('Your query has been submitted successfully! An admin will contact you soon.');
      navigate('/');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header with Background */}
      <div className="relative py-24 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://picsum.photos/seed/legal-help-form/1920/1080?blur=4")',
            filter: 'brightness(0.3)'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-5xl font-bold text-white tracking-tight">Get Legal Help</h1>
          <p className="text-slate-200 text-xl max-w-2xl mx-auto">
            Fill out the form below with your details. Your information is kept strictly confidential.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 w-full">
        <Card className="shadow-xl border-none rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-900 text-white p-8">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
              <CardTitle>Legal Inquiry Form</CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              All fields are required. Data is visible only to authorized administrators.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    required 
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="rounded-xl border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (10 digits)</Label>
                  <Input 
                    id="phone" 
                    required 
                    type="tel"
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="rounded-xl border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    required 
                    placeholder="e.g. Salt Lake, Kolkata"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="rounded-xl border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Legal Category</Label>
                  <Select onValueChange={(val) => setFormData({...formData, category: val})}>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Civil">Civil</SelectItem>
                      <SelectItem value="Criminal">Criminal</SelectItem>
                      <SelectItem value="Family">Family</SelectItem>
                      <SelectItem value="Property">Property</SelectItem>
                      <SelectItem value="Consumer">Consumer</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Issue</Label>
                <Textarea 
                  id="description" 
                  required 
                  placeholder="Please describe your legal issue in detail..."
                  className="min-h-[150px] rounded-xl border-slate-200"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-7 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <div className="flex items-center gap-2">
                    Submit Query <Send className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4 items-start">
          <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong>Privacy Guarantee:</strong> Your contact details (Phone Number) will never be disclosed on any open forum. Only our verified administrators can access this data to contact you for further assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
