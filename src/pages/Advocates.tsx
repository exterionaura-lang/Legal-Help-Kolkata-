import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Briefcase, Landmark, ShieldCheck, Filter, X, ArrowRight } from 'lucide-react';

interface Advocate {
  id: string;
  name: string;
  experience: number;
  court: string;
  specialization: string;
  status: string;
}

export default function Advocates() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [filterExperience, setFilterExperience] = useState('0');
  const [loading, setLoading] = useState(true);

  const uniqueSpecializations = useMemo(() => {
    const specs = new Set<string>();
    advocates.forEach(adv => {
      adv.specialization.split(',').forEach(s => specs.add(s.trim()));
    });
    return Array.from(specs).sort();
  }, [advocates]);

  useEffect(() => {
    const q = query(
      collection(db, 'advocates'),
      where('status', '==', 'approved')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Advocate[];
      setAdvocates(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredAdvocates = advocates.filter(adv => {
    const matchesSearch = adv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adv.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adv.court.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = filterSpecialization === 'all' || 
      adv.specialization.toLowerCase().includes(filterSpecialization.toLowerCase());
    
    const matchesExperience = adv.experience >= parseInt(filterExperience);

    return matchesSearch && matchesSpecialization && matchesExperience;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterSpecialization('all');
    setFilterExperience('0');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header with Background */}
      <div className="relative py-24 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://picsum.photos/seed/legal-directory/1920/1080?blur=4")',
            filter: 'brightness(0.3)'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-5xl font-bold text-white tracking-tight">Advocates Directory</h1>
          <p className="text-slate-200 text-xl max-w-2xl mx-auto">
            Browse our list of verified advocates practicing in Kolkata and West Bengal.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 w-full flex-grow">
        <div className="max-w-5xl mx-auto mb-20 space-y-8">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="Search by name, specialization, or court..."
              className="pl-14 py-8 rounded-2xl border-none shadow-xl text-xl bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 bg-white p-6 rounded-3xl shadow-md border border-slate-100">
            <div className="flex items-center gap-3 text-slate-900 text-sm font-bold uppercase tracking-widest mr-4">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Filter className="w-5 h-5 text-blue-600" />
              </div>
              <span>Refine Search</span>
            </div>

            <div className="w-full sm:w-64 space-y-1.5">
              <Label className="text-[10px] uppercase font-black text-slate-400 ml-1">Specialization</Label>
              <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
                <SelectTrigger className="rounded-xl border-slate-200 h-12 bg-slate-50/50">
                  <SelectValue placeholder="All Specializations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {uniqueSpecializations.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-64 space-y-1.5">
              <Label className="text-[10px] uppercase font-black text-slate-400 ml-1">Minimum Experience</Label>
              <Select value={filterExperience} onValueChange={setFilterExperience}>
                <SelectTrigger className="rounded-xl border-slate-200 h-12 bg-slate-50/50">
                  <SelectValue placeholder="Any Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Experience</SelectItem>
                  <SelectItem value="5">5+ Years</SelectItem>
                  <SelectItem value="10">10+ Years</SelectItem>
                  <SelectItem value="15">15+ Years</SelectItem>
                  <SelectItem value="20">20+ Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchTerm || filterSpecialization !== 'all' || filterExperience !== '0') && (
              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-12 px-6 font-bold"
              >
                <X className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredAdvocates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredAdvocates.map((adv) => (
              <Card key={adv.id} className="border-none shadow-md hover:shadow-xl transition-all rounded-2xl overflow-hidden group">
                <CardHeader className="bg-slate-900 text-white p-6">
                  <div className="flex justify-between items-start">
                    <div className="bg-blue-600 p-3 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-none">Verified</Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold">{adv.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="bg-slate-100 p-2 rounded-lg">
                      <ShieldCheck className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-slate-400">Experience</p>
                      <p className="font-semibold">{adv.experience} Years</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="bg-slate-100 p-2 rounded-lg">
                      <Landmark className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-slate-400">Practicing Court</p>
                      <p className="font-semibold">{adv.court}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Specialization</p>
                    <div className="flex flex-wrap gap-2">
                      {adv.specialization.split(',').map((spec, i) => (
                        <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-3 py-1">
                          {spec.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <Briefcase className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No advocates found</h3>
            <p className="text-slate-500">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {/* Join as Advocate Section */}
      <section className="relative py-24 px-4 overflow-hidden mt-12 group">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed transition-transform duration-700 group-hover:scale-105"
          style={{ 
            backgroundImage: 'url("https://picsum.photos/seed/advocate-join/1920/1080?blur=2")',
            filter: 'brightness(0.4)'
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white space-y-8">
          <h2 className="text-4xl font-bold tracking-tight">Are You a Practicing Advocate?</h2>
          <p className="text-xl text-slate-200 font-light leading-relaxed">
            Join our platform. Registration and listing are totally free for all interested Advocates.
          </p>
          <div className="flex justify-center">
            <Button 
              render={<Link to="/registration" className="flex items-center gap-2">Register as Advocate <ArrowRight className="w-5 h-5" /></Link>} 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-8 text-xl font-bold rounded-2xl shadow-xl shadow-blue-900/20" 
            />
          </div>
        </div>
      </section>
    </div>
  );
}
