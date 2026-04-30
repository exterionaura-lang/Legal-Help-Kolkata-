import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Phone, Mail, CheckCircle, XCircle, Trash2, MessageSquare, ExternalLink, Database, Info, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

interface LegalQuery {
  id: string;
  fullName: string;
  phone: string;
  location: string;
  category: string;
  description: string;
  status: string;
  createdAt: any;
}

interface Advocate {
  id: string;
  name: string;
  phone: string;
  email: string;
  experience: number;
  court: string;
  specialization: string;
  status: string;
  createdAt: any;
}

interface BlogPost {
  id: string;
  category: string;
  question: string;
  authorName: string;
  createdAt: any;
}

export default function Admin() {
  const [queries, setQueries] = useState<LegalQuery[]>([]);
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Pagination state
  const [currentPageQueries, setCurrentPageQueries] = useState(1);
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageApproved, setCurrentPageApproved] = useState(1);
  const [currentPageBlog, setCurrentPageBlog] = useState(1);
  const itemsPerPage = 10;

  const seedInitialAdvocates = async () => {
    setSeeding(true);
    const initialAdvocates = [
      {
        id: 'seed_1',
        name: 'Punyabrata Mukherjee/Mukhopadhyay',
        experience: 22,
        specialization: 'Civil & Property Registration',
        court: 'Calcutta High Court',
        phone: '8697457657',
        email: 'punyabrata@example.com',
        status: 'approved'
      },
      {
        id: 'seed_2',
        name: 'Sutapa Mondal',
        experience: 18,
        specialization: 'Criminal case',
        court: 'Alipore Court',
        phone: '8697457657',
        email: 'sutapa@example.com',
        status: 'approved'
      },
      {
        id: 'seed_3',
        name: 'Rajib Gangopadhyay',
        experience: 21,
        specialization: 'Criminal, Bail matters',
        court: 'Calcutta High Court',
        phone: '8697457657',
        email: 'rajib@example.com',
        status: 'approved'
      },
      {
        id: 'seed_4',
        name: 'Aninda Sarkar',
        experience: 23,
        specialization: 'Family and Civil matters',
        court: 'Barasat Court',
        phone: '8697457657',
        email: 'aninda@example.com',
        status: 'approved'
      },
      {
        id: 'seed_5',
        name: 'Debashis Ray',
        experience: 25,
        specialization: 'Constitutional & Criminal Law',
        court: 'Calcutta High Court',
        phone: '8697457657',
        email: 'debashis@example.com',
        status: 'approved'
      },
      {
        id: 'seed_6',
        name: 'Mousumi Bhattacharya',
        experience: 15,
        specialization: 'Family & Matrimonial Law',
        court: 'Sealdah Court',
        phone: '8697457657',
        email: 'mousumi@example.com',
        status: 'approved'
      }
    ];

    try {
      for (const adv of initialAdvocates) {
        const docRef = doc(db, 'advocates', adv.id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            ...adv,
            createdAt: serverTimestamp()
          });
        }
      }
      toast.success('6 Verified Advocates preloaded successfully!');
    } catch (error) {
      console.error('Seeding error:', error);
      toast.error('Failed to preload advocates');
    } finally {
      setSeeding(false);
    }
  };

  const seedBlogPosts = async () => {
    setSeeding(true);
    const blogData = [
      {
        id: 'blog_1',
        category: 'Property Dispute',
        question: 'How to check if a property has a clear title in Kolkata?',
        authorName: 'Amit Das',
        answer: 'You should verify the mother deed, search for encumbrances at the Registrar office for the last 30 years, and check mutation records at KMC.',
        advocate: 'Punyabrata Mukherjee'
      },
      {
        id: 'blog_2',
        category: 'Family Law',
        question: 'What is the procedure for mutual consent divorce in West Bengal?',
        authorName: 'Soma Roy',
        answer: 'Both parties must file a joint petition under Section 13B. There is a mandatory 6-month cooling-off period, though it can sometimes be waived.',
        advocate: 'Aninda Sarkar'
      },
      {
        id: 'blog_3',
        category: 'Criminal Law',
        question: 'What to do if a false FIR is filed against me?',
        authorName: 'Rahul Sen',
        answer: 'Immediately apply for anticipatory bail. You can also file a petition in the High Court under Section 482 to quash the false FIR.',
        advocate: 'Rajib Gangopadhyay'
      },
      {
        id: 'blog_4',
        category: 'Consumer Rights',
        question: 'Can I sue a builder for delay in flat possession?',
        authorName: 'Priya Singh',
        answer: 'Yes, you can approach the Consumer Forum or RERA. You are entitled to interest for the delay or a full refund with interest.',
        advocate: 'Punyabrata Mukherjee'
      },
      {
        id: 'blog_5',
        category: 'Labor & Employment',
        question: 'What are the rights of an employee terminated without notice?',
        authorName: 'Vikram Jha',
        answer: 'Check your appointment letter. Usually, you are entitled to notice pay and gratuity if you served more than 5 years.',
        advocate: 'Debashis Ray'
      },
      {
        id: 'blog_6',
        category: 'Cyber Law',
        question: 'How to report a financial fraud on social media?',
        authorName: 'Anjali Mehra',
        answer: 'Report immediately at cybercrime.gov.in and inform your bank to freeze the transaction. File a physical complaint at the local Cyber Cell.',
        advocate: 'Debashis Ray'
      },
      {
        id: 'blog_7',
        category: 'Taxation',
        question: 'Is GST applicable on residential rent in India?',
        authorName: 'Kunal Ghosh',
        answer: 'GST is applicable only if the residential property is rented to a GST-registered person/entity for business purposes.',
        advocate: 'Punyabrata Mukherjee'
      },
      {
        id: 'blog_8',
        category: 'Family Law',
        question: 'How is child custody decided in Indian courts?',
        authorName: 'Deepa Paul',
        answer: 'The primary consideration is the "welfare of the child." Courts look at the financial, emotional, and educational stability of parents.',
        advocate: 'Mousumi Bhattacharya'
      },
      {
        id: 'blog_9',
        category: 'Criminal Law',
        question: 'How to apply for anticipatory bail in a non-bailable offense?',
        authorName: 'Sanjay Dutta',
        answer: 'File an application in the Sessions Court or High Court under Section 438 CrPC before the arrest happens.',
        advocate: 'Rajib Gangopadhyay'
      },
      {
        id: 'blog_10',
        category: 'Civil Law',
        question: 'What is the validity of a registered Will?',
        authorName: 'Tapan Bose',
        answer: 'A registered Will is highly credible but can still be challenged on grounds of fraud, coercion, or lack of mental capacity.',
        advocate: 'Aninda Sarkar'
      },
      {
        id: 'blog_11',
        category: 'Property Dispute',
        question: 'Can a daughter claim share in ancestral property after marriage?',
        authorName: 'Rita Saha',
        answer: 'Yes, after the 2005 amendment to the Hindu Succession Act, daughters have equal rights as sons in ancestral property regardless of marriage.',
        advocate: 'Punyabrata Mukherjee'
      },
      {
        id: 'blog_12',
        category: 'Consumer Rights',
        question: 'How to file a complaint in the District Consumer Forum?',
        authorName: 'Arjun Das',
        answer: 'You can file it online via E-Daakhil or physically. No lawyer is strictly required; you can represent yourself.',
        advocate: 'Debashis Ray'
      },
      {
        id: 'blog_13',
        category: 'Family Law',
        question: 'What is the difference between maintenance and alimony?',
        authorName: 'Ishita Roy',
        answer: 'Maintenance is usually paid periodically during or after proceedings, while alimony is often a one-time lump sum settlement.',
        advocate: 'Mousumi Bhattacharya'
      },
      {
        id: 'blog_14',
        category: 'Criminal Law',
        question: 'What are the rights of an arrested person in India?',
        authorName: 'Manish Gupta',
        answer: 'Right to know grounds of arrest, right to consult a lawyer, and must be produced before a magistrate within 24 hours.',
        advocate: 'Sutapa Mondal'
      },
      {
        id: 'blog_15',
        category: 'Civil Law',
        question: 'How to send a legal notice for recovery of money?',
        authorName: 'Bimal Kar',
        answer: 'Draft a formal notice detailing the transaction, the default, and give a 15-day deadline before initiating legal action.',
        advocate: 'Aninda Sarkar'
      },
      {
        id: 'blog_16',
        category: 'Human Rights',
        question: 'What to do if police refuse to file an FIR?',
        authorName: 'Sunita Devi',
        answer: 'Send the complaint to the SP via registered post. If still no action, file a private complaint before the Magistrate under Sec 156(3).',
        advocate: 'Sutapa Mondal'
      },
      {
        id: 'blog_17',
        category: 'Corporate Law',
        question: 'How to register a small startup as an LLP?',
        authorName: 'Prateek Jain',
        answer: 'Apply for DIN/DSC, reserve name on MCA portal, and file incorporation documents. It offers limited liability with fewer compliances.',
        advocate: 'Debashis Ray'
      },
      {
        id: 'blog_18',
        category: 'Banking & Finance',
        question: 'Can a bank freeze my account without notice?',
        authorName: 'Joydeep Sen',
        answer: 'Only under specific orders from RBI, Income Tax, or Law Enforcement. They must eventually provide a reason for the freeze.',
        advocate: 'Debashis Ray'
      },
      {
        id: 'blog_19',
        category: 'Family Law',
        question: 'Procedure for adoption in India for NRIs?',
        authorName: 'Priyanka K.',
        answer: 'NRIs must register with CARA. The process involves home study reports and following the HAMA or JJ Act guidelines.',
        advocate: 'Mousumi Bhattacharya'
      },
      {
        id: 'blog_20',
        category: 'Property Dispute',
        question: 'How to resolve a boundary dispute with a neighbor?',
        authorName: 'Nitin Roy',
        answer: 'Get a government-approved surveyor to measure the land as per the deed. If unresolved, file a suit for mandatory injunction.',
        advocate: 'Punyabrata Mukherjee'
      }
    ];

    try {
      for (const item of blogData) {
        const postRef = doc(db, 'blog_posts', item.id);
        const postSnap = await getDoc(postRef);
        
        if (!postSnap.exists()) {
          await setDoc(postRef, {
            category: item.category,
            question: item.question,
            authorName: item.authorName,
            createdAt: serverTimestamp()
          });

          // Add answer
          const answerRef = doc(collection(db, `blog_posts/${item.id}/answers`));
          
          // Map seed advocates to realistic emails
          const emailMap: Record<string, string> = {
            'Punyabrata Mukherjee': 'punyabrata@example.com',
            'Sutapa Mondal': 'sutapa@example.com',
            'Rajib Gangopadhyay': 'rajib@example.com',
            'Aninda Sarkar': 'aninda@example.com',
            'Debashis Ray': 'debashis@example.com',
            'Mousumi Bhattacharya': 'mousumi@example.com'
          };
          
          await setDoc(answerRef, {
            postId: item.id,
            answer: item.answer,
            authorName: item.advocate,
            authorEmail: emailMap[item.advocate] || 'verified@example.com',
            authorRole: 'advocate',
            advocateUid: 'seed_uid',
            createdAt: serverTimestamp()
          });
        }
      }
      toast.success('20 Legal Questions & Answers preloaded!');
    } catch (error) {
      console.error('Blog seeding error:', error);
      toast.error('Failed to preload blog posts');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    // Queries listener - removed orderBy to ensure docs without createdAt are visible
    const qQueries = query(collection(db, 'queries'));
    const unsubscribeQueries = onSnapshot(qQueries, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LegalQuery[];
      // Sort in memory instead
      docs.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setQueries(docs);
    });

    // Advocates listener - removed orderBy
    const qAdvocates = query(collection(db, 'advocates'));
    const unsubscribeAdvocates = onSnapshot(qAdvocates, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Advocate[];
      docs.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setAdvocates(docs);
      setLoading(false);
    });

    // Blog posts listener
    const qBlog = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
    const unsubscribeBlog = onSnapshot(qBlog, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
      setBlogPosts(docs);
    });

    return () => {
      unsubscribeQueries();
      unsubscribeAdvocates();
      unsubscribeBlog();
    };
  }, []);

  const handleUpdateStatus = async (collectionName: string, id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, collectionName, id), { status: newStatus });
      
      // If we are approving an advocate, ensure their user record is also marked as advocate
      if (collectionName === 'advocates' && newStatus === 'approved') {
        const userRef = doc(db, 'users', id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          await updateDoc(userRef, { role: 'advocate' });
        }
      }
      
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast.success('Record deleted successfully');
    } catch (error) {
      console.error(`Error deleting from ${collectionName}:`, error);
      toast.error('Failed to delete record. Please check permissions.');
    }
  };

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/91${cleanPhone}`, '_blank');
  };

  // Pagination helper
  const paginate = (items: any[], currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = (items: any[]) => Math.ceil(items.length / itemsPerPage);

  const PaginationControls = ({ 
    currentPage, 
    totalItems, 
    onPageChange 
  }: { 
    currentPage: number, 
    totalItems: number, 
    onPageChange: (page: number) => void 
  }) => {
    const pages = totalPages({ length: totalItems } as any);
    if (pages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-100">
        <div className="text-sm text-slate-500">
          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 p-0 rounded-lg ${currentPage === page ? "bg-slate-900" : ""}`}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === pages}
            className="rounded-lg"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 text-lg">Manage legal help queries and advocate registrations with full oversight.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="outline" 
              onClick={seedInitialAdvocates} 
              disabled={seeding}
              className="bg-white border-slate-200 hover:bg-slate-50 py-6 px-6 rounded-xl shadow-sm"
            >
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              {seeding ? 'Preloading...' : 'Preload 6 Advocates'}
            </Button>
            <Button 
              variant="outline" 
              onClick={seedBlogPosts} 
              disabled={seeding}
              className="bg-white border-slate-200 hover:bg-slate-50 py-6 px-6 rounded-xl shadow-sm"
            >
              <MessageSquare className="w-5 h-5 mr-2 text-amber-600" />
              {seeding ? 'Preloading...' : 'Preload 20 Blog Posts'}
            </Button>
            <Badge variant="outline" className="px-6 py-3 bg-white shadow-sm border-slate-200 text-sm font-bold rounded-xl">
              Total Queries: {queries.length}
            </Badge>
            <Badge variant="outline" className="px-6 py-3 bg-white shadow-sm border-slate-200 text-sm font-bold rounded-xl">
              Advocates: {advocates.length}
            </Badge>
          </div>
        </div>

        <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 flex gap-6 items-start shadow-sm">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
            <Info className="w-6 h-6 text-white shrink-0" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-blue-900">Admin Access Information</h3>
            <p className="text-blue-800 leading-relaxed text-lg opacity-90">
              To access this dashboard, you must login with the authorized administrator email: <strong className="underline decoration-blue-400 decoration-2 underline-offset-4">1legalhelpkolkata@gmail.com</strong>. 
              Once logged in, the "Admin Panel" option will appear in your profile menu. 
              This dashboard allows you to view sensitive user data (Phone Numbers) which is hidden from the public for privacy.
            </p>
          </div>
        </div>

        <Tabs defaultValue="queries" className="space-y-10">
          <TabsList className="bg-white p-1.5 rounded-2xl shadow-md border border-slate-200 h-auto flex-wrap justify-start">
            <TabsTrigger value="queries" className="rounded-xl px-10 py-3 text-lg font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
              User Queries
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-xl px-10 py-3 text-lg font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
              Pending Advocates
            </TabsTrigger>
            <TabsTrigger value="approved" className="rounded-xl px-10 py-3 text-lg font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
              Approved Advocates
            </TabsTrigger>
            <TabsTrigger value="blog" className="rounded-xl px-10 py-3 text-lg font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
              Manage Blog
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queries" className="space-y-6">
            <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="bg-white border-b border-slate-100 p-10">
                <CardTitle className="text-3xl font-bold">Legal Help Queries</CardTitle>
                <CardDescription className="text-lg">View and manage incoming legal help requests from citizens.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[700px]">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 pl-10">Date</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">User Details</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Category</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 w-[400px]">Description</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Status</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 text-right pr-10">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginate(queries, currentPageQueries).map((q) => (
                        <TableRow key={q.id} className="hover:bg-slate-50/30 transition-colors border-slate-50">
                          <TableCell className="text-xs text-slate-400 font-bold pl-10">
                            {q.createdAt && format(q.createdAt.toDate(), 'MMM d, HH:mm')}
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="font-bold text-slate-900 text-lg">{q.fullName}</div>
                            <div className="flex flex-col gap-1 mt-2">
                              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                <Phone className="w-3.5 h-3.5 text-blue-500" /> {q.phone}
                              </div>
                              <div className="text-xs text-slate-400 font-medium">{q.location}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none px-4 py-1.5 font-bold rounded-lg">
                              {q.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600 leading-relaxed py-6">
                            <div className="line-clamp-3 hover:line-clamp-none transition-all cursor-help bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                              {q.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`px-4 py-1.5 rounded-full font-bold uppercase text-[10px] tracking-widest ${q.status === 'new' ? 'bg-amber-500 shadow-lg shadow-amber-200' : 'bg-green-500 shadow-lg shadow-green-200'}`}>
                              {q.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-10">
                            <div className="flex justify-end gap-3">
                              <Button size="icon" variant="outline" onClick={() => openWhatsApp(q.phone)} className="rounded-xl hover:bg-green-50 hover:border-green-200 w-10 h-10">
                                <MessageSquare className="w-5 h-5 text-green-600" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="outline" 
                                onClick={() => handleUpdateStatus('queries', q.id, q.status === 'new' ? 'contacted' : 'new')}
                                className="rounded-xl hover:bg-blue-50 hover:border-blue-200 w-10 h-10"
                              >
                                {q.status === 'new' ? <CheckCircle className="w-5 h-5 text-blue-600" /> : <XCircle className="w-5 h-5 text-amber-600" />}
                              </Button>
                              <Button size="icon" variant="outline" onClick={() => handleDelete('queries', q.id)} className="rounded-xl hover:bg-red-50 hover:border-red-200 w-10 h-10">
                                <Trash2 className="w-5 h-5 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <PaginationControls 
                  currentPage={currentPageQueries} 
                  totalItems={queries.length} 
                  onPageChange={setCurrentPageQueries} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="bg-white border-b border-slate-100 p-10">
                <CardTitle className="text-3xl font-bold">Pending Advocate Registrations</CardTitle>
                <CardDescription className="text-lg">Review and approve new advocate applications for the directory.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[700px]">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 pl-10">Advocate Info</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Experience</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Court & Specialization</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 text-right pr-10">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginate(advocates.filter(a => a.status === 'pending'), currentPagePending).map((adv) => (
                        <TableRow key={adv.id} className="hover:bg-slate-50/30 transition-colors border-slate-50">
                          <TableCell className="py-8 pl-10">
                            <div className="font-bold text-slate-900 text-lg">{adv.name}</div>
                            <div className="space-y-2 mt-3">
                              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                <Phone className="w-3.5 h-3.5 text-blue-500" /> {adv.phone}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                <Mail className="w-3.5 h-3.5 text-blue-500" /> {adv.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-black text-xl text-slate-900">{adv.experience} <span className="text-xs text-slate-400 uppercase tracking-widest">Years</span></div>
                          </TableCell>
                          <TableCell className="py-8">
                            <div className="text-lg font-bold text-slate-800">{adv.court}</div>
                            <div className="text-sm text-slate-500 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">{adv.specialization}</div>
                          </TableCell>
                          <TableCell className="text-right pr-10">
                            <div className="flex justify-end gap-3">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleUpdateStatus('advocates', adv.id, 'approved')}
                                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-600 hover:text-white rounded-xl px-6 py-5 font-bold transition-all"
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleUpdateStatus('advocates', adv.id, 'rejected')}
                                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-600 hover:text-white rounded-xl px-6 py-5 font-bold transition-all"
                              >
                                Reject
                              </Button>
                              <Button size="icon" variant="outline" onClick={() => handleDelete('advocates', adv.id)} className="rounded-xl hover:bg-red-50 hover:border-red-200 w-10 h-10">
                                <Trash2 className="w-5 h-5 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {advocates.filter(a => a.status === 'pending').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-24 text-slate-400">
                            <div className="flex flex-col items-center gap-4">
                              <CheckCircle className="w-12 h-12 text-slate-200" />
                              <p className="text-lg font-medium">No pending registrations at this time.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <PaginationControls 
                  currentPage={currentPagePending} 
                  totalItems={advocates.filter(a => a.status === 'pending').length} 
                  onPageChange={setCurrentPagePending} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="bg-white border-b border-slate-100 p-10">
                <CardTitle className="text-3xl font-bold">Approved Advocates</CardTitle>
                <CardDescription className="text-lg">List of all verified advocates currently active on the platform.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[700px]">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 pl-10">Advocate Info</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Experience</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Court & Specialization</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 text-right pr-10">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginate(advocates.filter(a => a.status === 'approved'), currentPageApproved).map((adv) => (
                        <TableRow key={adv.id} className="hover:bg-slate-50/30 transition-colors border-slate-50">
                          <TableCell className="py-8 pl-10">
                            <div className="font-bold text-slate-900 text-lg">{adv.name}</div>
                            <div className="space-y-2 mt-3">
                              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                <Phone className="w-3.5 h-3.5 text-blue-500" /> {adv.phone}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                <Mail className="w-3.5 h-3.5 text-blue-500" /> {adv.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-black text-xl text-slate-900">{adv.experience} <span className="text-xs text-slate-400 uppercase tracking-widest">Years</span></div>
                          </TableCell>
                          <TableCell className="py-8">
                            <div className="text-lg font-bold text-slate-800">{adv.court}</div>
                            <div className="text-sm text-slate-500 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">{adv.specialization}</div>
                          </TableCell>
                          <TableCell className="text-right pr-10">
                            <div className="flex justify-end gap-3">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleUpdateStatus('advocates', adv.id, 'rejected')}
                                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-600 hover:text-white rounded-xl px-6 py-5 font-bold transition-all"
                              >
                                Revoke
                              </Button>
                              <Button size="icon" variant="outline" onClick={() => handleDelete('advocates', adv.id)} className="rounded-xl hover:bg-red-50 hover:border-red-200 w-10 h-10">
                                <Trash2 className="w-5 h-5 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {advocates.filter(a => a.status === 'approved').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-24 text-slate-400">
                            <div className="flex flex-col items-center gap-4">
                              <ShieldCheck className="w-12 h-12 text-slate-200" />
                              <p className="text-lg font-medium">No approved advocates found.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <PaginationControls 
                  currentPage={currentPageApproved} 
                  totalItems={advocates.filter(a => a.status === 'approved').length} 
                  onPageChange={setCurrentPageApproved} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="blog" className="space-y-6">
            <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
              <CardHeader className="bg-white border-b border-slate-100 p-10">
                <CardTitle className="text-3xl font-bold">Blog Management</CardTitle>
                <CardDescription className="text-lg">View and delete blog posts and legal awareness inquiries.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[700px]">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 pl-10">Date</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Category</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 w-[500px]">Question</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Author</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 text-right pr-10">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginate(blogPosts, currentPageBlog).map((post) => (
                        <TableRow key={post.id} className="hover:bg-slate-50/30 transition-colors border-slate-50">
                          <TableCell className="text-xs text-slate-400 font-bold pl-10">
                            {post.createdAt && format(post.createdAt.toDate(), 'MMM d, HH:mm')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none px-4 py-1.5 font-bold rounded-lg">
                              {post.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="text-slate-900 font-medium leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                              {post.question}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-bold text-slate-600">
                            {post.authorName}
                          </TableCell>
                          <TableCell className="text-right pr-10">
                            <div className="flex justify-end gap-3">
                              <Button size="icon" variant="outline" onClick={() => handleDelete('blog_posts', post.id)} className="rounded-xl hover:bg-red-50 hover:border-red-200 w-10 h-10">
                                <Trash2 className="w-5 h-5 text-red-600" />
                              </Button>
                              <Button size="icon" variant="outline" render={<Link to="/blog" />} className="rounded-xl hover:bg-blue-50 hover:border-blue-200 w-10 h-10">
                                <ExternalLink className="w-5 h-5 text-blue-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <PaginationControls 
                  currentPage={currentPageBlog} 
                  totalItems={blogPosts.length} 
                  onPageChange={setCurrentPageBlog} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
